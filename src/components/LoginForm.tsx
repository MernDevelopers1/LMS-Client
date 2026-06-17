"use client";

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
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await onSubmit({ email, password });
      setSuccessMessage("Login successful!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (submitError: any) {
      setLocalError(submitError?.message || "Unable to log in.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[2fr_1fr]">
        <section className="flex min-h-[44vh] items-center justify-center bg-[linear-gradient(110deg,#ff442c_0%,#ff365f_58%,#fb326d_100%)] px-6 text-white lg:min-h-screen">
          <div className="w-full max-w-5xl text-center">
            <h1 className="text-4xl font-normal leading-tight sm:text-5xl lg:text-[52px]">
              {title}
            </h1>
            <p className="mt-5 text-lg font-normal sm:text-2xl">{subtitle}</p>
          </div>
        </section>

        <section className="flex min-h-[56vh] flex-col items-center justify-center px-6 py-12 lg:min-h-screen">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[480px] flex-col items-center"
          >
            <h2 className="text-center text-[42px] font-normal leading-tight">
              {buttonLabel}
            </h2>
            <p className="mt-4 max-w-[460px] text-center text-[22px] leading-8">
              Please enter your credentials to continue.
            </p>

            {localError || error ? (
              <div className="mt-8 w-full rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-900 shadow-sm">
                <p className="font-medium">{localError || error}</p>
              </div>
            ) : null}

            <div className="mt-6 flex w-full flex-col gap-4">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="username"
                disabled={status === "loading"}
                className={`h-[54px] w-full rounded-[6px] bg-white px-4 text-xl outline-none transition ${
                  localError || error
                    ? "border border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border border-slate-300 focus:border-blue-400 focus:ring-blue-200"
                }`}
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                disabled={status === "loading"}
                className={`h-12 w-full rounded-[4px] bg-white px-4 text-lg outline-none transition ${
                  localError || error
                    ? "border border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                    : "border border-slate-300 focus:border-blue-400 focus:ring-blue-200"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[5px] bg-blue-600 px-5 text-[21px] font-normal text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Logging in...
                </span>
              ) : (
                buttonLabel
              )}
            </button>

            {successMessage ? (
              <div className="mt-4 rounded-lg bg-emerald-100 px-4 py-3 text-emerald-800">
                {successMessage}
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
