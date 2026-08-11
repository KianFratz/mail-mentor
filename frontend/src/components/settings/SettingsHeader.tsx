import React from "react";

function SettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-tight text-foreground">
        Settings
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage your personal profile, security options, connected services, and
        account data.
      </p>
    </div>
  );
}

export default SettingsHeader;
