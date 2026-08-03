import { Injectable } from '@nestjs/common';

interface CategoryScoreEnty {
  name: string;
  score: number;
  maxScore: number;
}

@Injectable()
export class BadgeService {}
