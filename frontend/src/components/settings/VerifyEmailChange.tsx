import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Button } from "../ui/button";
import api from "@/lib/axios";

function VerifyEmailChange() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleConfirm = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    setStatus("verifying");

    try {
      await api.post(`/users/me/email/verify?token=${token}`);

      setStatus("success");
      setMessage("Your email address has been successfully changed.");
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "This verification link is invalid or has expired.",
      );
    }
  };

  if (status === "idle") {
    return (
      <div>
        <h1>Confirm Email Change</h1>
        <p>Click the button below to confirm your new email address.</p>
        {!token && (
          <p style={{ color: "red" }}>Verification token is missing from the link.</p>
        )}
        <Button onClick={handleConfirm} disabled={!token}>
          Confirm Email Change
        </Button>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div>
        <h1>Verifying your email...</h1>
        <p>Please wait while we confirm your email change.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <h1>Email verification failed</h1>
        <p>{message}</p>
        <button onClick={() => navigate("/settings")}>Back to Settings</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Email Changed Successfully</h1>
      <p>{message}</p>
      <Button onClick={() => navigate("/settings")}>Back to Settings</Button>
    </div>
  );
}

export default VerifyEmailChange;
