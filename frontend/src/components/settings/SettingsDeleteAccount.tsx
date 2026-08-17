import React, { useState } from "react";
import { AlertTriangle, RefreshCw, ShieldAlert, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toastManager } from "../ui/toast";
import { useSettingsStore } from "@/store/settings.store";
import { performLogout } from "@/lib/tokenEvents";

function SettingsDeleteAccount() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const { deleteAccount, isDeleting, error, reset } = useSettingsStore();

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setConfirmationInput("");
    reset();
  };

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmationInput.trim() !== "DELETE") {
      toastManager.add({
        title: "Confirmation Failed",
        description: "Please type DELETE to confirm account deletion.",
        type: "error",
      });
      return;
    }

    const success = await deleteAccount();

    if (success) {
      toastManager.add({
        title: "Account Deleted",
        description: "Your account has been permanently removed.",
        type: "success",
      });
      await performLogout();
    } else {
      toastManager.add({
        title: "Deletion Failed",
        description:
          useSettingsStore.getState().error ||
          "Failed to delete account. Please try again.",
        type: "error",
      });
    }
  };

  const isConfirmed = confirmationInput.trim() === "DELETE";

  return (
    <>
      <section id="section-danger" className="space-y-4 scroll-mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Danger Zone
            </h2>
            <p className="text-xs text-muted-foreground">
              Irreversible actions related to your Mail Mentor account.
            </p>
          </div>
        </div>

        <div className="bg-destructive/5 border border-destructive/30 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Delete Account
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                Permanently delete your Mail Mentor account, writing history,
                saved templates, and badge accomplishments. This action cannot
                be undone.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="gap-2 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </section>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-semibold">Delete Account</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you absolutely sure you want to delete your account? All
                  of your saved data, scores, badges, and subscription details
                  will be{" "}
                  <strong className="text-foreground">
                    permanently erased
                  </strong>
                  .
                </p>

                <div className="p-3 bg-muted rounded-lg border border-border space-y-1.5">
                  <label
                    htmlFor="delete-confirmation-input"
                    className="text-xs font-medium text-foreground block"
                  >
                    To confirm, type{" "}
                    <span className="font-mono font-bold text-destructive">
                      DELETE
                    </span>{" "}
                    below:
                  </label>
                  <Input
                    id="delete-confirmation-input"
                    name="deleteConfirmation"
                    type="text"
                    value={confirmationInput}
                    onChange={(e) => setConfirmationInput(e.target.value)}
                    placeholder="Type DELETE"
                    className="bg-background text-xs font-mono"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={!isConfirmed || isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Confirm Permanent Deletion
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsDeleteAccount;
