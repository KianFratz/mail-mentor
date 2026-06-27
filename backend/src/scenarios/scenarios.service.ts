import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ScenariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.scenario.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.scenario.findUnique({
      where: { id },
    });
  }
}
