import api from "@/lib/axios";
import type { RecentScore } from "@/types/dashboard.type";
import { create } from "zustand";

interface RecentScoresStore {
  scores: RecentScore[];
  loading: boolean;

  fetchRecentScores: () => Promise<void>;
  onViewAll?: () => void;
}

export const useRecentScoresStore = create<RecentScoresStore>((set) => ({
  scores: [],
  loading: false,

  fetchRecentScores: async (limit?: number, page = 1) => {
    set({ loading: true });

    try {
      const { data } = await api.get("/recent-scores/me", {
        params: {
          limit,
          page,
        },
      });

      set({
        scores: data.map((session: any) => ({
          id: session.id,
          title: session.scenario.title,
          date: session.createdAt,
          score: session.sessionFeedback.overallScore,
        })),
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
