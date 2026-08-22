import { Eye, EyeOff, Loader2, Mail, Save, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";
import { useSettingsStore } from "@/store/settings.store";

function SettingsAccountProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    requestEmailChange,
    reset,
    requestNameChange,
    fetchProfile,
    userProfile,
    isEmailSaving,
  } = useSettingsStore();
  const { error: currentError } = useSettingsStore.getState();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChangeName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUserName = formData.get("newName") as string;
    const resetForm = e.currentTarget;

    const result = await requestNameChange({ newUserName });

    if (result) {
      resetForm.reset();
      reset();
      toastManager.add({
        description: "Name updated successfully",
        title: "Success!",
        type: "success",
      });
    } else {
      toastManager.add({
        description: currentError || "Something went wrong",
        title: "Error!",
        type: "error",
      });
    }
  };

  const handleChangeEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("newEmail") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const resetForm = e.currentTarget;

    const result = await requestEmailChange({ newEmail, currentPassword });
    if (result) {
      resetForm.reset();
      reset();
      toastManager.add({
        description: "Check your new email for a confirmation link",
        title: "Success!",
        type: "success",
      });
    } else {
      toastManager.add({
        description: currentError || "Something went wrong",
        title: "Error!",
        type: "error",
      });
    }
  };

  return (
    <section id="section-profile" className="space-y-6 scroll-mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <p className="text-xs text-muted-foreground">
              Update your identity details, communication goals, and writing
              profile information.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="shrink-0 w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xs ring-2 ring-primary/20">
            <span className="text-xl font-bold text-primary-foreground select-none">
              {userProfile?.name
                ? userProfile.name
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "?"}
            </span>
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-semibold text-foreground">
              {userProfile?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userProfile?.email}
            </p>
            <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-1"></p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            Member since{" "}
            {userProfile?.createdAt
              ? new Date(userProfile.createdAt).toLocaleDateString()
              : "Loading..."}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleChangeName}
        className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Change Full Name
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              New Name
            </label>
            <Input
              name="newName"
              placeholder="Alan Turing"
              className="bg-background"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <Button type="submit" variant="secondary" className="gap-2">
              <Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Update Name
            </Button>
          </div>
        </div>
      </form>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Change Email
          </h3>
        </div>

        <form
          onSubmit={handleChangeEmail}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              New Email
            </label>
            <Input
              name="newEmail"
              placeholder="example@company.com"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Current Password
            </label>
            <div className="relative">
              <Input
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-background pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end pt-2">
            <Button
              type="submit"
              variant="secondary"
              className="gap-2"
              disabled={isEmailSaving}
            >
              {isEmailSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              Update Email
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SettingsAccountProfile;
