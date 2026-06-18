"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type LoginFormProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  onSuccess?: () => void;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

export default function LoginForm({
  title,
  subtitle,
  buttonLabel,
  onSubmit,
  onSuccess,
  status,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const visibleError = localError || error;
  const isLoading = status === "loading";

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      return "Email and password are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await onSubmit({ email, password });
      onSuccess?.();
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to log in.";
      setLocalError(message);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef6fc] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <section className="flex min-h-[42vh] flex-col items-center justify-center px-6 py-10 text-center lg:min-h-screen lg:px-12">
          <div className="flex w-full max-w-[620px] flex-col items-center">
            <Image
              src="/vertex-logo.svg"
              alt="Vertex Human Capital Management"
              width={354}
              height={86}
              priority
              className="h-auto w-[250px] sm:w-[310px] lg:w-[354px]"
            />

            <h1 className="mt-8 text-[26px] font-medium leading-tight text-black sm:text-[32px]">
              {title}
            </h1>
            <p className="mt-2 max-w-[620px] text-base font-normal leading-7 text-black sm:text-[18px]">
              {subtitle}
            </p>

            <Image
              src="/attendance-illustration.svg"
              alt="Attendance management illustration"
              width={430}
              height={430}
              priority
              className="mt-4 h-auto w-[260px] sm:w-[340px] lg:w-[430px]"
            />

            <footer className="mt-8 hidden items-center gap-6 text-sm text-[#4a66c7] sm:flex">
              <span>© 2023 Unity. All Rights Reserved.</span>
              <Image
                src="/vertex-logo.svg"
                alt=""
                width={36}
                height={18}
                className="h-6 w-10 object-contain"
              />
              <span>Ver. 1.0.03</span>
            </footer>
          </div>
        </section>

        <section className="flex min-h-[58vh] items-center justify-center bg-white px-5 py-10 lg:min-h-screen lg:bg-transparent">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[650px] rounded-[28px] bg-white px-6 py-10 shadow-[0_4px_28px_rgba(15,23,42,0.22)] sm:px-10 md:px-14 lg:px-10 xl:px-[38px]"
          >
            <div className="flex flex-col items-center">
              <Image
                src="/vertex-logo.svg"
                alt="Group"
                width={120}
                height={42}
                className="h-auto w-[112px] object-contain"
              />
              <h2 className="mt-11 text-center text-[30px] font-semibold leading-none text-[#171717]">
                Login
              </h2>
            </div>

            <div className="mt-16 flex flex-col gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[16px] font-semibold text-black"
                >
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="faisal@viiontech.com"
                  autoComplete="username"
                  disabled={isLoading}
                  className="mt-3 h-[70px] w-full rounded-[6px] border border-[#e6eaf0] bg-white px-5 text-[20px] text-slate-900 outline-none transition placeholder:text-[#8c8f98] focus:border-[#214d88] focus:ring-4 focus:ring-[#214d88]/10 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[16px] font-semibold text-black"
                >
                  Password
                </label>
                <div className="relative mt-3">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-[70px] w-full rounded-[6px] border border-[#e6eaf0] bg-white px-5 pr-16 text-[20px] text-slate-900 outline-none transition placeholder:text-[#8c8f98] focus:border-[#214d88] focus:ring-4 focus:ring-[#214d88]/10 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-300 transition hover:text-[#214d88] focus:outline-none focus:ring-2 focus:ring-[#214d88]/20"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      {showPassword ? (
                        <>
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                          <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 4.2" />
                          <path d="M6.7 6.7C3.7 8.7 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 4.4-1" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 text-[16px] sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-[#888b96]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-5 w-5 rounded border-[#9aa0aa] accent-[#214d88]"
                />
                <span>Keep me logged in</span>
              </label>
              <a
                href="#"
                className="font-medium text-[#123e86] underline-offset-2 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {visibleError ? (
              <div className="mt-5 rounded-[6px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                {visibleError}
              </div>
            ) : null}

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-16 w-full max-w-[220px] items-center justify-center rounded-[5px] bg-[#224f91] text-[21px] font-semibold text-white shadow-[0_14px_28px_rgba(34,79,145,0.28)] transition hover:bg-[#183f78] focus:outline-none focus:ring-4 focus:ring-[#224f91]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Logging in..." : buttonLabel}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
