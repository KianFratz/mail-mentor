import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNavTabs from "@/components/settings/SettingsNavTabs";
import SettingsAccountProfile from "@/components/settings/SettingsAccountProfile";
import SettingsDeleteAccount from "@/components/settings/SettingsDeleteAccount";
import SettingsSecurity from "@/components/settings/SettingsSecurity";

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-2 space-y-8">
      <SettingsHeader />
      <SettingsNavTabs />
      <SettingsAccountProfile />
      <SettingsSecurity />
      <SettingsDeleteAccount />
    </div>
  );
}
