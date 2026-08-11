import { KeyRound, ShieldAlert, User } from "lucide-react";
import React, { useState } from "react";

function SettingsNavTabs() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile",
  );
  
  return (
    <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
      <button
        onClick={() => {
          setActiveTab("profile");
          document
            .getElementById("section-profile")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
          activeTab === "profile"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        <User className="w-4 h-4" />
        Account
      </button>
      <button
        onClick={() => {
          setActiveTab("security");
          document
            .getElementById("section-security")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
          activeTab === "security"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        <KeyRound className="w-4 h-4" />
        Security
      </button>
      <button
        onClick={() => {
          setActiveTab("danger");
          document
            .getElementById("section-danger")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
          activeTab === "danger"
            ? "bg-destructive text-destructive-foreground shadow-sm"
            : "text-destructive/80 hover:text-destructive hover:bg-destructive/10"
        }`}
      >
        <ShieldAlert className="w-4 h-4" />
        Danger Zone
      </button>
    </div>
  );
}

export default SettingsNavTabs;
