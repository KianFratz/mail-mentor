import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes PrismaService accessible everywhere without re-importing the module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
