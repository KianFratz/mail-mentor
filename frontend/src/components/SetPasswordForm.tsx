import api from "@/lib/axios";
import React, { useState, useEffect } from "react";

export const SetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setHasPassword(response.data.hasPassword);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (hasPassword === null) {
    return null;
  }

  if (hasPassword === true) {
    return null; // Form won't show if user already has a password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.")
    }

    if (password !== confirmPassword) {
        setError("Password do not match.");
        return;
    }

    try {
        setLoading(true);
        await api.post("/auth/set-password", {
            password: password
        });

        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
    } catch (err: any) {
        if (err.response?.status === 409) {
            setError("Your account already has a password set.")
        } else {
            setError(err.response?.data?.message || 'Failed to set password. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <p className="font-semibold">Password set successfully!</p>
            <p className="text-sm">You can now log in using your email and password.</p>
        </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Set Local Password
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Since you signed up with Google, you don't have a password yet. Set one
        here to log in with your email directly.
      </p>
      {error && (
        <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};
