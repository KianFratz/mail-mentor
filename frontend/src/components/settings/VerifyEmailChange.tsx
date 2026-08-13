import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../ui/button";
import { useVerifyEmailChangeStore } from "@/store/verify-email-change.store";

function VerifyEmailChange() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { status, message, confirmEmailChange, reset } =
    useVerifyEmailChangeStore();

  const token = searchParams.get("token");

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleConfirm = () => {
    confirmEmailChange(token ?? "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Email Change Verification
            </h1>
            <p className="text-xs text-muted-foreground">
              Confirm your new email address to complete the change.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-5">
          {status === "idle" && (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Confirm Email Change
                </h2>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You requested a change to your email address. Click the button
                  below to verify and activate your new email.
                </p>

                {!token && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/30">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive leading-relaxed">
                      Verification token is missing from the link. Please use
                      the link sent to your email.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Settings
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!token}
                  onClick={handleConfirm}
                  className="gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Confirm Email Change
                </Button>
              </div>
            </>
          )}

          {status === "verifying" && (
            <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
              <div className="p-3 rounded-full bg-primary/10">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Verifying your email…
                </p>
                <p className="text-xs text-muted-foreground">
                  Please wait while we confirm your email change.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-foreground">
                  Email Changed Successfully
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                    {message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your account email has been updated. Please use your new email
                  address to sign in going forward.
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Settings
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <h2 className="text-sm font-semibold text-foreground">
                  Verification Failed
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/30">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive leading-relaxed">
                    {message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If this problem persists, please request a new email change
                  from your account settings.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Settings
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={!token}
                  onClick={handleConfirm}
                  className="gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailChange;
