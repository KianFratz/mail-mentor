import { toastManager } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/axios";
import { trackAnalyticsEvent } from "@/lib/analytics";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const registrationInputClassName =
  "w-full rounded-sm border-0 border-b border-[#c5c5d3] bg-transparent px-0 py-3 text-[16px] font-normal leading-[24px] outline-none transition-all duration-300 placeholder:text-[#6b6d78] focus:border-[#00236f] focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-2";

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
    <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] p-4 font-['Inter',sans-serif] text-[#1a1b21]">
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
                aria-hidden="true"
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
              <p className="font-semibold text-[24px] leading-[32px] tracking-tight">
                Mail Mentor
              </p>
            </div>

            <p className="mb-6 text-[32px] font-semibold leading-[40px] tracking-[-0.01em]">
              Write with more confidence, one reply at a time.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#90a8ff]/10 flex items-center justify-center flex-shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[#90a8ff]">
                    auto_awesome
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] leading-[16px] tracking-[0.01em] mb-1">
                    Practice realistic replies
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] text-[#d8e0ff]">
                    Work through workplace scenarios before the real
                    conversation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#90a8ff]/10 flex items-center justify-center flex-shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-[#90a8ff]">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] leading-[16px] tracking-[0.01em] mb-1">
                    Get coaching you can use
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] text-[#d8e0ff]">
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
            <p className="mt-2 text-[14px] leading-[21px] text-[#edf1ff]">
              Flags risk without naming the help needed. Name the blocker, who
              can unblock it, and when you’ll ask.
            </p>
            <p className="mt-5 border-t border-white/20 pt-4 text-[12px] leading-[18px] text-[#d8e0ff]">
              Mail Mentor helps you practice realistic email conversations and
              turn feedback into a clearer next reply.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 lg:p-16 bg-[#ffffff]">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8 flex items-center gap-2 text-[#00236f] lg:hidden">
              <span
                aria-hidden="true"
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
              <h1 className="mb-2 font-semibold text-[24px] leading-[32px] text-[#1a1b21] lg:text-[32px] lg:leading-[40px]">
                Create Account
              </h1>
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
                    className={registrationInputClassName}
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
                    className={registrationInputClassName}
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
                    className={registrationInputClassName}
                    id="password"
                    aria-describedby="password-requirements"
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
                <p
                  id="password-requirements"
                  className="mt-2 flex items-center gap-1 text-[12px] font-medium leading-[16px] text-[#444651]"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                    info
                  </span>
                  Must be at least 6 characters
                </p>
              </div>

              <button
                className="w-full py-4 bg-[#00236f] text-[#ffffff] rounded-xl font-semibold text-[14px] leading-[16px] shadow-lg hover:shadow-[#00236f]/20 active:scale-[0.98] transition-all duration-200 mt-8 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 disabled:opacity-70"
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin text-white"
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
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span aria-hidden="true" className="material-symbols-outlined text-sm">
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

          <footer className="mt-auto flex justify-center gap-6 pt-8 text-[#444651] transition-all duration-500">
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
