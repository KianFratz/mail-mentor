import api from "@/lib/axios";
import { create } from "zustand";

interface RequestEmailChangePayload {
  newEmail: string;
  currentPassword: string;
}

interface RequestNameChangePayload {
  newUserName: string;
}

interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  email: string;
}

interface RequestPasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

interface SettingsStore {
  isLoading: boolean;
  error: string | null;
  verificationSent: boolean;
  userProfile: UserProfile;

  requestEmailChange: (payload: RequestEmailChangePayload) => Promise<boolean>;
  requestNameChange: (payload: RequestNameChangePayload) => Promise<boolean>;
  requestPasswordChange: (
    payload: RequestPasswordChangePayload,
  ) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  isLoading: false,
  error: null,
  verificationSent: false,
  userProfile: undefined,

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
        "Failed to request email change. Please try again later.";

      set({ isLoading: false, error: message, verificationSent: false });
      return false;
    }
  },

  requestNameChange: async ({ newUserName }) => {
    set({ isLoading: true, error: null });

    try {
      await api.patch("/users/me/name", {
        newUserName,
      });

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Faild to request name change. Please try again later";

      set({ isLoading: false, error: message });
      return false;
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.get("users/me");
      set({
        userProfile: {
          id: data?.id ?? "",
          name: data?.name ?? "",
          createdAt: data?.createdAt ?? "",
          email: data?.email ?? "",
        },
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ?? "Failed to fetch user profile data";

      set({ isLoading: false, error: message });
    }
  },

  requestPasswordChange: async ({ currentPassword, newPassword }) => {
    set({ isLoading: true, error: null });

    try {
      await api.patch("/users/me/password", {
        currentPassword,
        newPassword,
      });

      set({ isLoading: false });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        "Failed to update password. Please try again later";

      set({ isLoading: false, error: message });
      return false;
    }
  },

  reset: () => set({ isLoading: false, error: null }),
}));
