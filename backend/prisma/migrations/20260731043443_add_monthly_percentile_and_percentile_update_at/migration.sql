-- AlterTable
ALTER TABLE "user_streaks" ADD COLUMN     "monthlyPercentile" DOUBLE PRECISION,
ADD COLUMN     "percentileUpdateAt" TIMESTAMP(3);
