import {
  Building,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import React, { useState, type HtmlHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toastManager } from "../ui/toast";
import { useSettingsStore } from "@/store/settings.store";

interface ConnectedAccount {
  id: string;
  name: string;
  email: string;
  connected: boolean;
  provider: "google" | "microsoft" | "github";
}

function SettingsSecurity() {
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [isExporting, setIsExporting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([
    {
      id: "1",
      name: "Google Workspace",
      email: "alex.morgan@gmail.com",
      connected: true,
      provider: "google",
    },
    {
      id: "2",
      name: "Microsoft Outlook",
      email: "alex.m@corporate.com",
      connected: true,
      provider: "microsoft",
    },
    {
      id: "3",
      name: "GitHub",
      email: "",
      connected: false,
      provider: "github",
    },
  ]);

  const { requestPasswordChange, reset } = useSettingsStore();
  const { error: currentError } = useSettingsStore.getState();

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const resetForm = e.currentTarget;

    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      toastManager.add({
        description: "Please fill all the required fields",
        title: "Error!",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toastManager.add({
        description: "New password and confirm password doesn't match",
        title: "Error!",
        type: "error",
      });
      return;
    }

    const result = await requestPasswordChange({
      currentPassword,
      newPassword,
    });

    if (result) {
      resetForm.reset();
      reset();
      toastManager.add({
        description: "Password change successfully!",
        title: "Success!",
        type: "sucess",
      });
    } else {
      toastManager.add({
        description: currentError || "Something went wrong",
        title: "Error!",
        type: "error",
      });
      return;
    }
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const dataPayload = {
        exportDate: new Date().toISOString(),
        userProfile: profile,
        securityInfo: {
          connectedAccounts: connectedAccounts
            .filter((a) => a.connected)
            .map((a) => a.name),
        },
        mockData: {
          writingSessionsCount: 42,
          averageClarityScore: 94,
          totalBadgesEarned: 12,
        },
      };

      const dataStr =
        exportFormat === "json"
          ? "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(dataPayload, null, 2))
          : "data:text/csv;charset=utf-8," +
            encodeURIComponent(
              "Metric,Value\n" +
                `Name,${profile.name}\n` +
                `Email,${profile.email}\n` +
                `Export Date,${new Date().toLocaleDateString()}\n`,
            );

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `mail_mentor_data_export.${exportFormat}`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toastManager.add({
        title: "Export Complete",
        description: `Downloaded your Mail Mentor data as ${exportFormat.toUpperCase()}.`,
        type: "success",
      });
    }, 1000);
  };

  const handleToggleAccount = (id: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextState = !acc.connected;
          toastManager.add({
            title: nextState ? "Account Connected" : "Account Disconnected",
            description: nextState
              ? `Successfully linked ${acc.name} to your Mail Mentor account.`
              : `Disconnected ${acc.name}.`,
            type: nextState ? "success" : "info",
          });
          return {
            ...acc,
            connected: nextState,
            email: nextState
              ? acc.email ||
                `${profile.name.toLowerCase().replace(" ", ".")}@example.com`
              : "",
          };
        }
        return acc;
      }),
    );
  };

  return (
    <section id="section-security" className="space-y-6 scroll-mt-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="text-xs text-muted-foreground">
            Manage your password, connected auth providers, active sessions, and
            data exports.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Change Password
          </h3>
        </div>

        <form
          onSubmit={handleUpdatePassword}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Current Password
            </label>
            <div className="relative">
              <Input
                required
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-background pr-9"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              New Password
            </label>
            <div className="relative">
              <Input
                name="newPassword"
                required
                type={showNewPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                className="bg-background pr-9"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Confirm New Password
            </label>
            <Input
              required
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-background"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <Button
              type="submit"
              variant="secondary"
              disabled={isUpdatingPassword}
              className="gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Connected Accounts
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Link your social or enterprise sign-in providers to enable seamless
            access.
          </p>
        </div>

        <div className="divide-y divide-border">
          {connectedAccounts.map((account) => (
            <div
              key={account.id}
              className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted flex items-center justify-center">
                  {account.provider === "google" && (
                    <Mail className="w-4 h-4 text-red-500" />
                  )}
                  {account.provider === "microsoft" && (
                    <Building className="w-4 h-4 text-blue-500" />
                  )}
                  {account.provider === "github" && (
                    <Laptop className="w-4 h-4 text-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.connected ? account.email : "Not linked"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {account.connected ? (
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                    Not Connected
                  </span>
                )}
                <Button
                  type="button"
                  variant={account.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleAccount(account.id)}
                >
                  {account.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Export My Data
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download a complete archive copy of your Mail Mentor data,
                scores, and activity history.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">
              Data Archive Format
            </p>
            <p className="text-[11px] text-muted-foreground">
              Includes profile info, writing sessions, feedback analytics, and
              earned badges.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(e.target.value as "json" | "csv")
              }
              className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground outline-none"
            >
              <option value="json">JSON (.json)</option>
              <option value="csv">CSV (.csv)</option>
            </select>

            <Button
              type="button"
              onClick={handleExportData}
              disabled={isExporting}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Export
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsSecurity;
