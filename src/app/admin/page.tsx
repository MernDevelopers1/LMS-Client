"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, loginAdmin } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import LoginForm from "../../components/LoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error, user, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (initialized && user) {
      router.replace(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [initialized, router, user]);

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      return;
    }
    throw new Error(result.payload as string);
  };

  return (
    <LoginForm
      title="Admin Portal"
      subtitle="Login here if you are an administrator."
      buttonLabel="Admin Login"
      onSubmit={handleSubmit}
      onSuccess={() => router.push("/admin/dashboard")}
      status={status}
      error={error}
    />
  );
}
