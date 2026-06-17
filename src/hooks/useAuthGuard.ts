"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchCurrentUser, logoutUser } from "../features/auth/authSlice";

type RoleGuardOptions = {
  role?: string;
  loginPath: string;
};

export default function useAuthGuard({ role, loginPath }: RoleGuardOptions) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.initialized) {
      dispatch(fetchCurrentUser());
      return;
    }

    if (auth.status === "loading") {
      return;
    }
    console.log("Auth state:", auth);
    console.log("loginPath :>> ", loginPath);
    if (!auth.user) {
      router.replace(loginPath);
      return;
    }

    if (role && auth.user.role !== role) {
      dispatch(logoutUser());
      router.replace(loginPath);
    }
  }, [auth, dispatch, loginPath, role, router]);

  return auth;
}
