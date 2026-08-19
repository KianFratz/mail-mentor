import api from "@/lib/axios";
import React, { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settings.store";
import { X } from "lucide-react";

interface SetPasswordFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const SetPasswordForm: React.FC<SetPasswordFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const { fetchProfile } = useSettingsStore();

  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const response = await api.get("/auth/me");
        setHasPassword(response.data.hasPassword);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    checkPasswordStatus();
  }, []);

  if (hasPassword === null) {
    return null;
  }

  if (hasPassword === true) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/set-password", {
        password: password,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      await fetchProfile();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Your account already has a password set.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to set password. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative p-6 bg-card border border-border text-foreground rounded-xl shadow-lg space-y-4 max-w-md mx-auto">
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <p className="font-semibold">Password set successfully!</p>
          <p className="text-sm mt-1">
            You can now disconnect your Google account or log in using your email and password.
          </p>
        </div>
        {onClose && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative p-6 bg-card text-foreground rounded-xl shadow-lg border border-border max-w-md mx-auto">
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <h2 className="text-xl font-bold text-foreground mb-2">
        Set Local Password
      </h2>
      <p className="text-xs text-muted-foreground mb-6">
        Since you signed up with Google, you don't have a password yet. Set a
        password first before disconnecting your Google account.
      </p>
      {error && (
        <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Saving..." : "Set Password"}
          </button>
        </div>
      </form>
    </div>
  );
};
