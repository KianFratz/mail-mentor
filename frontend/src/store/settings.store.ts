import api from "@/lib/axios";
import { create } from "zustand";

type AuthProviders = "LOCAL" | "GOOGLE";

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
  authProviders: AuthProviders[];
}

interface RequestPasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

interface SettingsStore {
  isLoading: boolean;
  isEmailSaving: boolean;
  error: string | null;
  verificationSent: boolean;
  userProfile?: UserProfile;
  isDeleting: boolean;
  isExporting: boolean;

  exportUserData: (format: "json" | "csv") => Promise<boolean>;
  disconnectGoogle: () => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
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
  isEmailSaving: false,
  error: null,
  verificationSent: false,
  userProfile: undefined,
  isDeleting: false,
  isExporting: false,

  requestEmailChange: async ({ newEmail, currentPassword }) => {
    set({ isEmailSaving: true, error: null, verificationSent: false });

    try {
      await api.patch("/users/me/email", {
        newEmail,
        currentPassword,
      });

      set({ isEmailSaving: false, verificationSent: true });
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to request email change. Please try again later.";

      set({ isEmailSaving: false, error: message, verificationSent: false });
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
          authProviders: data?.authProviders ?? [],
        },
        isLoading: false,
      });
    } catch (error: any) {
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
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Failed to update password. Please try again later";

      set({ isLoading: false, error: message });
      return false;
    }
  },

  deleteAccount: async () => {
    set({ isDeleting: true, error: null });
    try {
      await api.delete("/users/me", {
        data: { confirmation: "DELETE" },
      });
      set({ isDeleting: false });
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Failed to delete account. Please try again later.";

      set({ isDeleting: false, error: message });
      return false;
    }
  },

  disconnectGoogle: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post("/auth/disconnect-google");

      set((state) => ({
        isLoading: false,
        userProfile: state.userProfile
          ? {
              ...state.userProfile,
              authProviders: state.userProfile.authProviders.filter(
                (p) => p !== "GOOGLE",
              ),
            }
          : undefined,
      }));
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Failed to disconnect Google account. Please try again";

      set({ isLoading: false, error: message });
      return false;
    }
  },
  exportUserData: async (format: "json" | "csv") => {
    set({ isExporting: true, error: null });

    try {
      const response = await api.get("/users/me/export", {
        params: { format },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: format === "json" ? "application/json" : "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `mail_mentor_export_${Date.now()}.${format}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      set({ isExporting: false });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        "Failed to export data archive. Please try again later.";
      set({ isExporting: false, error: message });
      return false;
    }
  },
  reset: () => set({ isLoading: false, error: null }),
}));
