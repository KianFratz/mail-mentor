import api from "@/lib/axios";
import { create } from "zustand";

interface CriteriaConfig {
  category?: string;
  threshold?: number;
  minSessions?: number;
  sessions?: number;
  days?: number;
  increase?: number;
  score?: number;
}

export interface Badge {
  id: string;
  key: string;
  title: string;
  subTitle: string;
  icon: string;
  variant: string;
  criteriaType: string;
  criteriaConfig: CriteriaConfig;
  createdAt: string;
}

export interface UserBadgeRecord {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  earnedAt: string | null;
  badge: Badge;
}

interface BadgeStore {
  userBadges: UserBadgeRecord[];
  loading: boolean;
  fetchUserBadge: () => Promise<void>;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
  userBadges: [],
  loading: false,

  fetchUserBadge: async () => {
    set({ loading: true });

    try {
      const { data } = await api.get<any[]>("/badges/user");

      const badges: UserBadgeRecord[] = (data || []).map((item) => ({
        id: item.id,
        userId: item.userId,
        badgeId: item.badgeId,
        progress: item.progress ?? 0,
        earnedAt: item.earnedAt ?? null,
        badge: {
          id: item.badge?.id ?? "",
          key: item.badge?.key ?? "",
          title: item.badge?.title ?? "",
          subTitle: item.badge?.subTitle ?? "",
          icon: item.badge?.icon ?? "",
          variant: item.badge?.variant ?? "",
          criteriaType: item.badge?.criteriaType ?? "",
          criteriaConfig: {
            category: item.badge?.criteriaConfig?.category,
            threshold: item.badge?.criteriaConfig?.threshold,
            minSessions: item.badge?.criteriaConfig?.minSessions,
            sessions: item.badge?.criteriaConfig?.sessions,
        days: item.badge?.criteriaConfig?.days,
            increase: item.badge?.criteriaConfig?.increase,
            score: item.badge?.criteriaConfig?.score,
          },
          createdAt: item.badge?.createdAt ?? "",
        },
      }));

      set({ userBadges: badges, loading: false });
    } catch (error) {
      console.error("Failed fetching user badges ", error);
    } finally {
      set({ loading: false });
    }
  },
}));
