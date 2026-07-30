import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { startOfWeek, addDays, format, differenceInDays } from 'date-fns';

@Injectable()
export class StreakService {
  constructor(private prisma: PrismaService) {}

  async getStreak(userId: string) {
    return this.prisma.userStreak.findUnique({
      where: { userId },
    });
  }

  async getWeeklyStreak(userId: string) {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const logs = await this.prisma.practiceLog.findMany({
      where: { userId, date: { gte: monday } },
    });

    const loggedDays = new Set(
      logs.map((l) => l.date.toISOString().slice(0, 10)),
    );

    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      const iso = d.toISOString().slice(0, 10);

      return {
        day: format(d, 'EEEEE'), // 'M', 'T', 'W'...
        completed: loggedDays.has(iso),
        isFuture: d > new Date(),
      };
    });
  }

  async recordPractice(userId: string, localDate: string) {
    const today = new Date(localDate);

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.practiceLog.upsert({
        where: { userId_date: { userId, date: today } },
        create: { userId, date: today },
        update: {},
      });

      const streak = await tx.userStreak.findUnique({ where: { userId } });

      let newStreak = 1;
      let graceUsed = streak?.graceUsedThisStreak ?? false;

      if (streak?.lastActiveDate) {
        const daySinceLastActive = differenceInDays(
          today,
          streak.lastActiveDate,
        );

        if (daySinceLastActive === 0) {
          newStreak = streak.currentStreak;
        } else if (daySinceLastActive === 1) {
          newStreak = streak.currentStreak + 1;
          graceUsed = false;
        } else if (daySinceLastActive === 2 && !streak.graceUsedThisStreak) {
          newStreak = streak.currentStreak + 1;
          graceUsed = true;
        } else {
          newStreak = 1;
          graceUsed = false;
        }
      }

      return tx.userStreak.upsert({
        where: { userId },
        create: {
          userId,
          currentStreak: newStreak,
          longestStreak: newStreak,
          lastActiveDate: today,
          graceUsedThisStreak: graceUsed,
        },
        update: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak?.longestStreak ?? 0),
          lastActiveDate: today,
          graceUsedThisStreak: graceUsed,
        },
      });
    });
  }
}
