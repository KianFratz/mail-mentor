import { Mail, RefreshCw, Save, User } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toastManager } from "../ui/toast";

function SettingsAccountProfile() {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
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
        className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              Full Name
            </label>
            <Input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Email Address
              </span>
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="alex@example.com"
              className="bg-background"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={isSavingProfile} className="gap-2">
            {isSavingProfile ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default SettingsAccountProfile;
