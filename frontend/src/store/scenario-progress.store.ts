import api from "@/lib/axios";
import { create } from "zustand";

interface ScenarioProgressStore {
  unlockedLevels: string[];
  loading: boolean;
  fetchProgress: () => Promise<void>;
  isLevelUnlocked: (level: string) => boolean;
}

export const useScenarioProgressStore = create<ScenarioProgressStore>(
  (set, get) => ({
    unlockedLevels: ["beginner"],
    loading: true,

    fetchProgress: async () => {
      set({ loading: true });
      try {
        const { data } = await api.get("/scenarios/progress");
        set({ unlockedLevels: data.unlockedLevels });
      } catch (error) {
        console.error("Failed to fetch scenario progress:", error);
      } finally {
        set({ loading: false });
      }
    },

    isLevelUnlocked: (level: string) => {
      const normalizedLevel = level?.toLowerCase() || "beginner";
      return get().unlockedLevels.includes(normalizedLevel);
    },
  })
);
