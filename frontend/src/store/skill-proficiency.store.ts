import api from "@/lib/axios";
import type { SkillProficiency } from "@/types/dashboard.type";
import { create } from "zustand";

interface SkillProficiencyStore {
  overallScore: number;
  skills: SkillProficiency[];
  loading: boolean;

  fetchSkillProficiency: () => Promise<void>;
}

export const useSkillProficiencyStore = create<SkillProficiencyStore>(
  (set) => ({
    overallScore: 0,
    skills: [],
    loading: false,

    fetchSkillProficiency: async () => {
      set({ loading: true });

      try {
        const { data } = await api.get("/skill-proficiency/proficiency-scores");

        set({
          overallScore: data.overall.percentage,
          skills: data.progress.map((item: any) => ({
            name: item.category,
            percentage: item.percentage,
          })),
        });
      } catch (error) {
        console.error(error);
      } finally {
        set({ loading: false });
      }
    },
  }),
);
