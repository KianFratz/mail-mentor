import api from "@/lib/axios";
import { create } from "zustand";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

interface VerifyEmailChangeStore {
  status: VerifyStatus;
  message: string;

  confirmEmailChange: (token: string) => Promise<void>;
  reset: () => void;
}

export const useVerifyEmailChangeStore = create<VerifyEmailChangeStore>(
  (set) => ({
    status: "idle",
    message: "",

    confirmEmailChange: async (token: string) => {
      if (!token) {
        set({
          status: "error",
          message: "Verification token is missing from the link.",
        });
        return;
      }

      set({ status: "verifying", message: "" });

      try {
        await api.post(`/users/me/email/verify?token=${token}`);

        set({
          status: "success",
          message: "Your email address has been successfully changed.",
        });
      } catch (err: any) {
        set({
          status: "error",
          message:
            err?.response?.data?.message ??
            "This verification link is invalid or has expired.",
        });
      }
    },

    reset: () => set({ status: "idle", message: "" }),
  }),
);
