"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCurrentUser, loginStudent } from "../../features/auth/authSlice";
import LoginForm from "../../components/LoginForm";

export default function StudentLoginPage() {
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

  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const result = await dispatch(loginStudent({ email, password }));
    if (loginStudent.fulfilled.match(result)) {
      return;
    }
    throw new Error(result.payload as string);
  };

  return (
    <LoginForm
      title="Student Portal"
      subtitle="Login here if you are a student."
      buttonLabel="Student Login"
      onSubmit={handleSubmit}
      onSuccess={() => router.push("/student/dashboard")}
      status={status}
      error={error}
    />
  );
}
