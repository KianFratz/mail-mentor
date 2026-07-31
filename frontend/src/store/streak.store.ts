import api from "@/lib/axios";
import type { StreakProps } from "@/types/streak.type";
import { create } from "zustand";

interface StreakStore {
  longestStreak: number;
  monthlyPercentile: number;
  weeklyStreak: StreakProps[];
  loading: boolean;

  fetchLongestStreak: () => Promise<void>;
  fetchWeeklyStreak: () => Promise<void>;
}

export const useStreakStore = create<StreakStore>((set) => ({
  longestStreak: 0,
  weeklyStreak: [],
  loading: false,

  fetchLongestStreak: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/streaks/me");

      set({
        longestStreak: data.longestStreak,
        monthlyPercentile: data.monthlyPercentile,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchWeeklyStreak: async () => {
    set({ loading: true });

    try {
      const { data } = await api.get("/streaks/me/week");

      set({
        weeklyStreak: data.map((item: any) => ({
          day: item.day,
          completed: item.completed,
          isFuture: item.isFuture,
        })),
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
