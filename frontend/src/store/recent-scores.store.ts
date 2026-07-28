import api from "@/lib/axios";
import type { RecentScore } from "@/types/dashboard.type";
import { create } from "zustand";

interface RecentScoresStore {
  scores: RecentScore[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;

  recentScores: RecentScore[];
  recentLoading: boolean;

  fetchRecentScores: (limit: number, page?: number) => Promise<void>;
  setPage: (page: number) => void;
}

export const useRecentScoresStore = create<RecentScoresStore>((set) => ({
  scores: [],
  loading: false,
  page: 1,
  totalPages: 0,
  total: 0,

  recentScores: [],
  recentLoading: false,

  setPage: (page: number) => set({ page }),

  fetchRecentScores: async (limit: number, page = 1) => {
    set({ loading: true });
    try {
      const { data } = await api.get("/recent-scores/me", {
        params: { limit, page },
      });

      set({
        scores: data.data.map((session: any) => ({
          id: session.id,
          title: session.scenario.title,
          date: session.createdAt,
          score: session.sessionFeedback.overallScore,
        })),
        totalPages: limit ? Math.ceil(data.total / limit) : 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
