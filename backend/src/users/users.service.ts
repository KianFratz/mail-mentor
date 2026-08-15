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

  async updateUserName(id: string, newUserName: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: newUserName,
      },
    });
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    if (newPassword !== currentPassword)
      throw new BadRequestException(
        'New password and current password does not match',
      );

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
}
