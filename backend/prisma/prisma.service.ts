import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Create the node-postgres connection pool using your docker environment variable
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // Instantiate the official Prisma PostgreSQL adapter
    const adapter = new PrismaPg(pool);

    // Initialize Prisma Client with the custom driver adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
