"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, loginTeacher } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import LoginForm from "../../components/LoginForm";

export default function TeacherLoginPage() {
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
    const result = await dispatch(loginTeacher({ email, password }));
    if (loginTeacher.fulfilled.match(result)) {
      return;
    }
    throw new Error(result.payload as string);
  };

  return (
    <LoginForm
      title="Teacher Portal"
      subtitle="Login here if you are a teacher."
      buttonLabel="Teacher Login"
      onSubmit={handleSubmit}
      onSuccess={() => router.push("/teacher/dashboard")}
      status={status}
      error={error}
    />
  );
}
