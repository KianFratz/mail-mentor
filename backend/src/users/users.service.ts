import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, User } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { triggerAsyncId } from 'async_hooks';

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
    const currentPasswordHash = await bcrypt.hash(currentPassword, salt);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: currentPasswordHash,
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

  async exportUserData(userId: string, format: 'json' | 'csv') {
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

      return format === 'csv'
        ? this.formatAsCsv(userData)
        : this.formatAsJson(userData);
    } catch (error) {
      throw error;
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
      streak: userData.streak
        ? {
            currentStreak: userData.userStreak.currentStreak,
            longestStreak: userData.userStreak.longestStreak,
            lastActiveDate: userData.userStreak.lastActiveDate,
          }
        : null,
      badges: userData.badges((ub: any) => ({
        title: ub.badge.title,
        progress: ub.progress,
        earnedAt: ub.earnedAt,
      })),
      writingSessions: userData.writingSession.map((ws: any) => ({
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
      })),
      practiceLogs: userData.practiceLog.map((pl: any) => pl.date),
    };
  }

  private escapeCsvField(value: any): string {
    if (value === null || value === undefined) return '';
    const str =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

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
}
