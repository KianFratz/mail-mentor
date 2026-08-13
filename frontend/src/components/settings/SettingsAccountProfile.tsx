import { Eye, EyeOff, Mail, Save, User } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";
import { useSettingsStore } from "@/store/settings.store";

function SettingsAccountProfile() {
  const { requestEmailChange, isLoading, error, verificationSent } =
    useSettingsStore();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    targetRole: "Executive Communication & Leadership",
    bio: "Focused on refining high-stakes email communication, executive messaging tone, and persuasive outreach.",
    preferredTone: "Professional & Direct",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    memberSince: "March 2025",
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toastManager.add({
        title: "Profile Updated",
        description:
          "Your personal information and communication preferences have been saved.",
        type: "success",
      });
    }, 600);
  };

  const handleChangeName = () => {};

  const handleChangeEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmail = formData.get("newEmail") as string;
    const currentPassword = formData.get("currentPassword") as string;

    const ok = await requestEmailChange({ newEmail, currentPassword });

    if (ok) {
      toastManager.add({
        description: "Check your new email for a confirmation link",
        title: "Success!",
        type: "success",
      });
    } else {
      toastManager.add({
        description: error || "Something went wrong",
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
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
          Member since {profile.memberSince}
        </span>
      </div>

      <form
        onSubmit={handleSaveProfile}
        className="bg-card border border-border rounded-xl p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative group">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-xs text-white font-medium">Change</span>
            </div>
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-semibold text-foreground">
              {profile.name}
            </h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-1"></p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                toastManager.add({
                  title: "Avatar Upload",
                  description:
                    "Select a new image file to update your avatar picture.",
                  type: "info",
                })
              }
            >
              Upload New Photo
            </Button>
          </div>
        </div>
      </form>

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
            <Input placeholder="Alan Turing" className="bg-background" />
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
            <Button type="submit" variant="secondary" className="gap-2">
              <Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Update Email
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SettingsAccountProfile;
