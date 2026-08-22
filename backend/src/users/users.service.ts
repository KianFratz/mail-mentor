import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { formatDate } from 'date-fns';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getUserProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        authProviders: true,
        createdAt: true,
      },
    });
  }

  async updateUserName(id: string, newUserName: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: newUserName,
      },
      select: { id: true, name: true },
    });
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User does not exist');

    if (!user.password) {
      throw new BadRequestException('User does not have a password set');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: newPasswordHash,
      },
      select: { id: true, email: true, name: true },
    });
  }

  async requestEmailChange(
    id: string,
    newEmail: string,
    currentPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User does not exist');

    if (!user.password) {
      throw new BadRequestException(
        'Email change not available for OAuth accounts',
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) throw new ConflictException('Email already in use');

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await this.prisma.user.update({
      where: { id },
      data: {
        pendingEmail: normalizedEmail,
        emailVerifyTokenHash: tokenHash,
        emailVerifyExpiresAt: expiresAt,
      },
    });

    // fire both — don't let one failure block the other
    const results = await Promise.allSettled([
      this.mailService.sendEmailChangeVerification(normalizedEmail, rawToken),
      this.mailService.sendEmailChangeNotice(user.email),
    ]);

    results.forEach((result, idx) => {
      if (result.status === 'rejected') {
        this.logger.error(`Email send failed for index ${idx}:`, result.reason);
      }
    });

    return { message: 'Verification email sent to your new address' };
  }

  async confirmEmailChange(rawToken: string) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: { emailVerifyTokenHash: tokenHash },
    });

    if (
      !user ||
      !user.emailVerifyExpiresAt ||
      user.emailVerifyExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    if (!user.pendingEmail) {
      throw new BadRequestException('No pending email change found');
    }

    // race-condition guard: someone else may have claimed this email in the meantime
    const conflict = await this.prisma.user.findUnique({
      where: { email: user.pendingEmail },
    });
    if (conflict && conflict.id !== user.id) {
      throw new ConflictException('Email already in use');
    }

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      },
      select: { id: true, email: true, name: true },
    });
  }

  async deleteAccount(id: string) {
    this.logger.warn(`Account deletion initiated for user ${id}`);
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      this.logger.warn(`Account successfully deleted for user: ${id}`);
      return {
        message: 'Account deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        this.logger.warn(`Delete failed - user not found: ${id}`);
        throw new NotFoundException('User not found');
      }
      this.logger.warn(
        `Unexpected error during account deletion for user: ${id}`,
      );
      throw error;
    }
  }

  async exportUserData(
    userId: string,
    format: 'json' | 'csv' | 'pdf',
  ): Promise<{ data: string | Buffer; filename: string; contentType: string }> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          authProviders: true,
          createdAt: true,

          userStreak: {
            select: {
              currentStreak: true,
              longestStreak: true,
              lastActiveDate: true,
            },
          },
          userBadges: {
            select: {
              progress: true,
              earnedAt: true,
              badge: {
                select: {
                  title: true,
                },
              },
            },
          },
          writingSession: {
            where: { status: 'graded' },
            select: {
              id: true,
              createdAt: true,
              messages: true,
              scenario: {
                select: {
                  title: true,
                  category: true,
                },
              },
              sessionFeedback: {
                select: {
                  overallScore: true,
                  categoryScores: true,
                  strengths: true,
                  improvements: true,
                },
              },
            },
          },
          practiceLog: {
            select: {
              date: true,
            },
          },
        },
      });

      if (!userData) {
        throw new NotFoundException('User not found');
      }

      if (format === 'pdf') {
        const html = this.buildPdfHtml(this.formatAsJson(userData));
        const pdfBuf = await this.generatePdf(html);

        return {
          data: pdfBuf,
          filename: `user-data-${userId}-${new Date().toISOString().split('T')[0]}.pdf`,
          contentType: 'application/pdf',
        };
      }

      return {
        data:
          format === 'csv'
            ? this.formatAsCsv(userData)
            : JSON.stringify(this.formatAsJson(userData), null, 2),
        filename: `user-data-${userId}-${new Date().toISOString().split('T')[0]}.${format}`,
        contentType: format === 'csv' ? 'text/csv' : 'application/json',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('PDF generation failed', error);
      throw new InternalServerErrorException('Failed to generate PDF export');
    }
  }

  private formatAsJson(userData: any) {
    return {
      exportedAt: new Date().toISOString(),
      profile: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        authProviders: userData.authProviders,
        createdAt: userData.createdAt,
      },
      streak: userData.userStreak
        ? {
            currentStreak: userData.userStreak.currentStreak,
            longestStreak: userData.userStreak.longestStreak,
            lastActiveDate: userData.userStreak.lastActiveDate,
          }
        : null,
      badges:
        userData.userBadges?.map((ub: any) => ({
          title: ub.badge?.title,
          progress: ub.progress,
          earnedAt: ub.earnedAt,
        })) ?? [],
      writingSessions:
        userData.writingSession?.map((ws: any) => ({
          id: ws.id,
          date: ws.createdAt,
          scenarioTitle: ws.scenario?.title,
          scenarioCategory: ws.scenario?.category,
          messages: ws.messages,
          feedback: ws.sessionFeedback
            ? {
                overallScore: ws.sessionFeedback.overallScore,
                categoryScores: ws.sessionFeedback.categoryScores,
                strengths: ws.sessionFeedback.strengths,
                improvements: ws.sessionFeedback.improvements,
              }
            : null,
        })) ?? [],
      practiceLogs: userData.practiceLog?.map((pl: any) => pl.date) ?? [],
    };
  }

  private escapeCsvField(value: any): string {
    if (value === null || value === undefined) return '';
    const str =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

    if (
      str.includes(',') ||
      str.includes('"') ||
      str.includes('\n') ||
      str.includes('\r')
    ) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private toCsvRow(fields: any[]): string {
    return fields.map((f) => this.escapeCsvField(f)).join(',');
  }

  private formatAsCsv(userData: any): string {
    const lines: string[] = [];

    lines.push('Summary Metrics');
    lines.push(this.toCsvRow(['Category', 'Key', 'Value']));

    lines.push(this.toCsvRow(['Profile', 'Name', userData.name]));
    lines.push(this.toCsvRow(['Profile', 'Email', userData.email]));
    lines.push(this.toCsvRow(['Profile', 'Created At', userData.createdAt]));

    if (userData.userStreak) {
      lines.push(
        this.toCsvRow([
          'Streak',
          'Current Streak',
          userData.userStreak.currentStreak,
        ]),
      );
      lines.push(
        this.toCsvRow([
          'Streak',
          'Longest Streak',
          userData.userStreak.longestStreak,
        ]),
      );
      lines.push(
        this.toCsvRow([
          'Streak',
          'Last Active Date',
          userData.userStreak.lastActiveDate,
        ]),
      );
    }

    userData.userBadges.forEach((ub: any) => {
      lines.push(
        this.toCsvRow([
          'Badge',
          ub.badge.title,
          `${ub.progress} (earned ${ub.earnedAt ?? 'in progress'})`,
        ]),
      );
    });

    lines.push('');

    lines.push('Writing Sessions');
    lines.push(
      this.toCsvRow([
        'Session ID',
        'Date',
        'Scenario',
        'Word Count',
        'Status',
        'Overall Score',
      ]),
    );

    userData.writingSession.forEach((ws: any) => {
      const wordCount = this.countWords(ws.messages);
      lines.push(
        this.toCsvRow([
          ws.id,
          ws.createdAt,
          ws.scenario?.title ?? '',
          wordCount,
          ws.status,
          ws.sessionFeedback?.overallScore ?? '',
        ]),
      );
    });

    return lines.join('\n');
  }

  private countWords(messages: any): number {
    if (!messages) return 0;

    try {
      const arr = Array.isArray(messages) ? messages : JSON.parse(messages);
      return arr.reduce((total: number, m: any) => {
        const text = m?.content ?? m?.text ?? '';
        return (
          total +
          (typeof text === 'string'
            ? text.trim().split(/\s+/).filter(Boolean).length
            : 0)
        );
      }, 0);
    } catch {
      return 0;
    }
  }

  private async generatePdf(html: string): Promise<Buffer> {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private buildPdfHtml(jsonData: any): string {
    const escapeHtml = (value: unknown): string => {
      if (value === undefined || value === null) {
        return 'N/A';
      }

      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeFormatDate = (
      value: unknown,
      pattern: string = 'yyyy-MM-dd',
    ): string => {
      if (!value) {
        return 'N/A';
      }

      try {
        const date = value instanceof Date ? value : new Date(String(value));

        if (Number.isNaN(date.getTime())) {
          return 'N/A';
        }

        return formatDate(date, pattern);
      } catch {
        return 'N/A';
      }
    };

    const getScoreColor = (score: number): string => {
      if (score >= 80) return '#16a34a';
      if (score >= 60) return '#d97706';

      return '#dc2626';
    };

    const renderScoreBar = (score: unknown): string => {
      const numericScore = Number(score);

      if (!Number.isFinite(numericScore)) {
        return `<span style="color: #6b7280;">N/A</span>`;
      }

      const normalizedScore = Math.max(0, Math.min(100, numericScore));

      const color = getScoreColor(normalizedScore);

      return `
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
      ">
        <div style="
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        ">
          <div style="
            width: ${normalizedScore}%;
            height: 100%;
            background: ${color};
            border-radius: 999px;
          "></div>
        </div>

        <span style="
          min-width: 36px;
          font-weight: 700;
          color: ${color};
        ">
          ${normalizedScore}
        </span>
      </div>
    `;
    };

    const renderList = (data: unknown): string => {
      if (!data) {
        return `<span class="empty">N/A</span>`;
      }

      const items = Array.isArray(data) ? data : [data];

      if (items.length === 0) {
        return `<span class="empty">N/A</span>`;
      }

      return `
      <ul>
        ${items
          .map(
            (item) => `
              <li>${escapeHtml(item)}</li>
            `,
          )
          .join('')}
      </ul>
    `;
    };

    const renderCategoryScores = (scores: unknown): string => {
      if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
        return `<span class="empty">No category scores available.</span>`;
      }

      return Object.entries(scores as Record<string, unknown>)
        .map(([category, score]) => {
          return `
          <div class="category-score">
            <div class="category-name">
              ${escapeHtml(category)}
            </div>

            ${renderScoreBar(score)}
          </div>
        `;
        })
        .join('');
    };

    const profile = jsonData.profile ?? {};
    const streak = jsonData.streak ?? {};
    const badges = jsonData.badges ?? [];
    const writingSessions = jsonData.writingSessions ?? [];
    const practiceLog = jsonData.practiceLogs ?? [];
    const appName = jsonData?.appName ?? 'Mail Mentor';
    const exportDate = jsonData?.exportDate ?? new Date().toISOString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${escapeHtml(appName)} - User Data Export</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, Helvetica, sans-serif;
      background: #ffffff;
      color: #111827;
      line-height: 1.5;
      font-size: 13px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .header {
      background: #111827;
      color: #ffffff;
      padding: 28px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0 0 8px;
      font-size: 26px;
    }

    .header p {
      margin: 4px 0;
      color: #d1d5db;
    }

    .section {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }

    .section h2 {
      font-size: 18px;
      margin: 0 0 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid #111827;
      color: #111827;
    }

    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 18px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .field {
      padding: 10px 12px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .field-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .field-value {
      color: #111827;
      word-break: break-word;
    }

    .streak-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .stat {
      text-align: center;
      padding: 18px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 25px;
      font-weight: 700;
      color: #111827;
    }

    .stat-label {
      font-size: 11px;
      color: #6b7280;
      margin-top: 4px;
    }

    .badge-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .badge {
      padding: 14px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .badge-title {
      font-weight: 700;
      margin-bottom: 6px;
    }

    .progress-track {
      height: 8px;
      background: #e5e7eb;
      border-radius: 999px;
      overflow: hidden;
      margin: 6px 0;
    }

    .progress-fill {
      height: 100%;
      background: #2563eb;
      border-radius: 999px;
    }

    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
      font-size: 11px;
    }

    th {
      background: #111827;
      color: #ffffff;
      text-align: left;
      padding: 9px;
      font-weight: 700;
    }

    td {
      padding: 10px 9px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    tr {
      page-break-inside: avoid;
    }

    .session-card {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 12px;
    }

    .session-title {
      font-size: 15px;
      font-weight: 700;
    }

    .score {
      font-weight: 700;
      white-space: nowrap;
    }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .subsection-title {
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .practice-dates {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .practice-date {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 8px;
      text-align: center;
    }

    .empty {
      color: #6b7280;
      font-style: italic;
    }

    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 10px;
      text-align: center;
    }

    @media print {
      body {
        padding: 20px;
      }

      .section {
        page-break-inside: avoid;
      }

      .session-card {
        page-break-inside: avoid;
      }
    }

    @media (max-width: 700px) {
      body {
        padding: 16px;
      }

      .grid,
      .badge-grid,
      .two-column {
        grid-template-columns: 1fr;
      }

      .streak-grid {
        grid-template-columns: 1fr;
      }

      .practice-dates {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <h1>${escapeHtml(appName)} — User Data Export</h1>

      <p>
        Export date:
        <strong>
        ${safeFormatDate(exportDate, 'yyyy-MM-dd')}</strong>
      </p>

      <p>
        User:
        <strong>
          ${escapeHtml(profile.name || 'N/A')}
        </strong>
        ${profile.email ? `(${escapeHtml(profile.email)})` : ''}
      </p>
    </div>

    <!-- PROFILE -->
    <section class="section">
      <h2>Profile</h2>

      <div class="card">
        <div class="grid">

          <div class="field">
            <span class="field-label">ID</span>
            <span class="field-value">
              ${escapeHtml(profile.id || 'N/A')}
            </span>
          </div>

          <div class="field">
            <span class="field-label">Name</span>
            <span class="field-value">
              ${escapeHtml(profile.name || 'N/A')}
            </span>
          </div>

          <div class="field">
            <span class="field-label">Email</span>
            <span class="field-value">
              ${escapeHtml(profile.email || 'N/A')}
            </span>
          </div>

          <div class="field">
            <span class="field-label">Auth Providers</span>
            <span class="field-value">
              ${
                Array.isArray(profile.authProviders)
                  ? profile.authProviders
                      .map((provider: unknown) => escapeHtml(provider))
                      .join(', ')
                  : 'N/A'
              }
            </span>
          </div>

          <div class="field">
            <span class="field-label">Account Created</span>
            <span class="field-value">
              ${safeFormatDate(profile.createdAt, 'yyyy-MM-dd')}
            </span>
          </div>

        </div>
      </div>
    </section>

    <!-- STREAK -->
    <section class="section">
      <h2>Streak</h2>

      <div class="card">
        <div class="streak-grid">

          <div class="stat">
            <div class="stat-value">
              ${escapeHtml(streak.currentStreak ?? 0)}
            </div>

            <div class="stat-label">
              Current Streak
            </div>
          </div>

          <div class="stat">
            <div class="stat-value">
              ${escapeHtml(streak.longestStreak ?? 0)}
            </div>

            <div class="stat-label">
              Longest Streak
            </div>
          </div>

          <div class="stat">
            <div class="stat-value">
              ${safeFormatDate(streak.lastActiveDate, 'yyyy-MM-dd')}
            </div>

            <div class="stat-label">
              Last Active Date
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- BADGES -->
    <section class="section">
      <h2>Badges</h2>

      <div class="card">
        ${
          badges.length === 0
            ? '<p class="empty">No badges found.</p>'
            : `
              <div class="badge-grid">
                ${badges
                  .map((userBadge: any) => {
                    const progress = Math.min(
                      100,
                      Math.max(0, Number(userBadge.progress ?? 0)),
                    );

                    return `
                      <div class="badge">
                        <div class="badge-title">
                          ${escapeHtml(
                            userBadge.title ??
                              userBadge.badge?.title ??
                              'Untitled Badge',
                          )}
                        </div>

                        <div>
                          Progress:
                          <strong>${progress}%</strong>
                        </div>

                        <div class="progress-track">
                          <div
                            class="progress-fill"
                            style="width: ${progress}%"
                          ></div>
                        </div>

                        <div style="
                          margin-top: 6px;
                          font-size: 11px;
                          color: #6b7280;
                        ">
                          Earned:
                          ${safeFormatDate(userBadge.earnedAt, 'yyyy-MM-dd')}
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            `
        }
      </div>
    </section>

    <!-- WRITING SESSIONS -->
    <section class="section">
      <h2>Writing Sessions</h2>

      ${
        writingSessions.length === 0
          ? `
            <div class="card">
              <p class="empty">No writing sessions found.</p>
            </div>
          `
          : writingSessions
              .map((session: any) => {
                const feedback =
                  session.feedback ?? session.sessionFeedback ?? {};

                const overallScore =
                  feedback.overallScore ?? session.overallScore ?? null;

                return `
                  <div class="card session-card">

                    <div class="session-header">
                      <div>
                        <div class="session-title">
                          ${escapeHtml(
                            session.scenario?.title ??
                              session.scenarioTitle ??
                              session.scenario ??
                              'Untitled Scenario',
                          )}
                        </div>

                        <div style="
                          color: #6b7280;
                          font-size: 11px;
                          margin-top: 3px;
                        ">
                          ${safeFormatDate(session.createdAt ?? session.date, 'yyyy-MM-dd')}
                        </div>
                      </div>

                      <div class="score">
                        Overall:
                        ${renderScoreBar(overallScore)}
                      </div>
                    </div>

                    <div class="two-column">

                      <div>
                        <div class="subsection-title">
                          Category Scores
                        </div>

                        ${renderCategoryScores(
                          feedback.categoryScores ?? session.categoryScores,
                        )}
                      </div>

                      <div>
                        <div class="subsection-title">
                          Strengths
                        </div>

                        ${renderList(feedback.strengths ?? session.strengths)}

                        <div
                          class="subsection-title"
                          style="margin-top: 14px;"
                        >
                          Improvements
                        </div>

                        ${renderList(
                          feedback.improvements ?? session.improvements,
                        )}
                      </div>

                    </div>

                  </div>
                `;
              })
              .join('')
      }
    </section>

    <!-- PRACTICE LOG -->
    <section class="section">
      <h2>Practice Log</h2>

      <div class="card">
        ${
          practiceLog.length === 0
            ? '<p class="empty">No practice dates found.</p>'
            : `
              <div class="practice-dates">
                ${practiceLog
                  .map(
                    (entry: any) => `
                      <div class="practice-date">
                        ${safeFormatDate(entry.createdAt ?? entry.date ?? entry, 'yyyy-MM-dd')}
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            `
        }
      </div>
    </section>

    <div class="footer">
      Generated by ${escapeHtml(appName)}
      on ${safeFormatDate(exportDate, 'yyyy-MM-dd')}
    </div>

  </div>
</body>
</html>
  `;
  }
}
