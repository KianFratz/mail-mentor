import api from "@/lib/axios";
import { create } from "zustand";

interface RequestEmailChangePayload {
  newEmail: string;
  currentPassword: string;
}

interface SettingsStore {
  isLoading: boolean;
  error: string | null;
  verificationSent: boolean;

  requestEmailChange: (payload: RequestEmailChangePayload) => Promise<boolean>;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isLoading: false,
  error: null,
  verificationSent: false,

  requestEmailChange: async ({ newEmail, currentPassword }) => {
    set({ isLoading: true, error: null, verificationSent: false });

    try {
      await api.patch("/users/me/email", {
        newEmail,
        currentPassword,
      });

      set({ isLoading: false, verificationSent: true });
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to request email change. Please try again.";

      set({ isLoading: false, error: message, verificationSent: false });
      return false;
    }
  },

  reset: () => set({ isLoading: false, error: null, verificationSent: false }),
}));
