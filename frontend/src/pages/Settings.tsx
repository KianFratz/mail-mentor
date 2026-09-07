import { useEffect } from "react";
import { useSearchParams } from "react-router";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNavTabs from "@/components/settings/SettingsNavTabs";
import SettingsAccountProfile from "@/components/settings/SettingsAccountProfile";
import SettingsDeleteAccount from "@/components/settings/SettingsDeleteAccount";
import SettingsSecurity from "@/components/settings/SettingsSecurity";
import { toastManager } from "@/components/ui/toast";
import { useSubscriptionStore } from "@/store/subscription.store";

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchSubscription } = useSubscriptionStore();

  // Handle payment success redirect from Xendit
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toastManager.add({
        title: "Payment Successful! 🎉",
        description:
          "Your subscription has been upgraded to Pro. It may take a moment to activate.",
        type: "success",
      });
      // Re-fetch subscription to pick up the new Pro status
      fetchSubscription();
      // Clean up the query param
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, fetchSubscription]);

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

