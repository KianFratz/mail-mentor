import { toastManager } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/axios";
import { trackAnalyticsEvent } from "@/lib/analytics";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await api.post("auth/register", {
        fullName,
        email,
        password,
      });

      toastManager.add({
        title: "Account created!",
        description: "Your account has been registered successfully.",
        type: "success",
      });

      saveToken(response.data.access_token);
      trackAnalyticsEvent("registration_completed", {
        source_surface: "registration",
      });
      navigate("/dashboard");
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message || error.response?.data || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toastManager.add({
        title: "Registration failed",
        description: message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#1a1b21] min-h-screen flex items-center justify-center p-4 font-['Inter',sans-serif]">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#00236f]/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#340081]/5 blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-[#faf8ff] rounded-2xl overflow-hidden shadow-xl min-h-[700px]">
        <section className="hidden lg:flex flex-col justify-between p-12 bg-[#1e3a8a] text-[#90a8ff] relative">
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e9ddff] via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
              <h1 className="font-semibold text-[24px] leading-[32px] tracking-tight">
                Mail Mentor
              </h1>
            </div>

            <h2 className="font-semibold text-[32px] leading-[40px] tracking-[-0.01em] mb-6">
              Write with more confidence, one reply at a time.
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#90a8ff]/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#90a8ff]">
                    auto_awesome
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] leading-[16px] tracking-[0.01em] mb-1">
                    Practice realistic replies
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] opacity-80">
                    Work through workplace scenarios before the real
                    conversation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#90a8ff]/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#90a8ff]">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] leading-[16px] tracking-[0.01em] mb-1">
                    Get coaching you can use
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] opacity-80">
                    See what worked, what to improve, and how to revise your
                    message.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/30 bg-white/10 p-6 text-white backdrop-blur-[12px]">
            <div className="flex items-center gap-2 text-[#c9d5ff]">
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                rate_review
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Sample coaching note
              </p>
            </div>
            <p className="mt-5 text-[15px] font-semibold leading-[22px]">
              “I might need some help”
            </p>
            <p className="mt-2 text-[14px] leading-[21px] text-white/80">
              Flags risk without naming the help needed. Name the blocker, who
              can unblock it, and when you’ll ask.
            </p>
            <p className="mt-5 border-t border-white/20 pt-4 text-[12px] leading-[18px] text-white/60">
              Mail Mentor helps you practice realistic email conversations and
              turn feedback into a clearer next reply.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 lg:p-16 bg-[#ffffff]">
          <div className="w-full max-w-sm mx-auto">
            <div className="lg:hidden flex items-center gap-2 mb-8 text-[#00236f]">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
              <span className="font-semibold text-[24px] leading-[32px]">
                Mail Mentor
              </span>
            </div>

            <header className="mb-10">
              <h2 className="font-semibold text-[24px] lg:text-[32px] leading-[32px] lg:leading-[40px] text-[#1a1b21] mb-2">
                Create Account
              </h2>
              <p className="font-normal text-[16px] leading-[24px] text-[#444651]">
                Practice realistic workplace replies and get coaching you can
                use in your next message.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block font-semibold text-[14px] leading-[16px] tracking-[0.01em] text-[#1a1b21] mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#c5c5d3] focus:ring-0 focus:border-[#00236f] transition-all duration-300 font-normal text-[16px] leading-[24px] placeholder:text-[#757682]/50 outline-none"
                    id="fullName"
                    name="fullName"
                    placeholder="Jane Doe"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#00236f] transition-all duration-300 ${formData.fullName ? "w-full" : "w-0 group-focus-within:w-full"}`}
                  ></div>
                </div>
              </div>

              <div>
                <label
                  className="block font-semibold text-[14px] leading-[16px] tracking-[0.01em] text-[#1a1b21] mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#c5c5d3] focus:ring-0 focus:border-[#00236f] transition-all duration-300 font-normal text-[16px] leading-[24px] placeholder:text-[#757682]/50 outline-none"
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#00236f] transition-all duration-300 ${formData.email ? "w-full" : "w-0 group-focus-within:w-full"}`}
                  ></div>
                </div>
              </div>

              <div>
                <label
                  className="block font-semibold text-[14px] leading-[16px] tracking-[0.01em] text-[#1a1b21] mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#c5c5d3] focus:ring-0 focus:border-[#00236f] transition-all duration-300 font-normal text-[16px] leading-[24px] placeholder:text-[#757682]/50 outline-none"
                    id="password"
                    minLength={6}
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#00236f] transition-all duration-300 ${formData.password ? "w-full" : "w-0 group-focus-within:w-full"}`}
                  ></div>
                </div>
                <p className="mt-2 font-medium text-[12px] leading-[16px] text-[#444651] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    info
                  </span>
                  Must be at least 6 characters
                </p>
              </div>

              <button
                className="w-full py-4 bg-[#00236f] text-[#ffffff] rounded-xl font-semibold text-[14px] leading-[16px] shadow-lg hover:shadow-[#00236f]/20 active:scale-[0.98] transition-all duration-200 mt-8 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-[#c5c5d3]/30 text-center">
              <p className="font-normal text-[16px] leading-[20px] text-[#444651]">
                Already have an account?{" "}
                <Link
                  className="text-[#00236f] font-bold hover:underline transition-all"
                  to="/login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <footer className="mt-auto pt-8 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-medium text-[12px] leading-[16px] uppercase tracking-widest">
              Enterprise Ready
            </span>
            <span className="font-medium text-[12px] leading-[16px] uppercase tracking-widest">
              GDPR Compliant
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
};
