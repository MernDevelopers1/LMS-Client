"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../hooks";
import { logoutUser } from "../../../features/auth/authSlice";
import useAuthGuard from "../../../hooks/useAuthGuard";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Teachers Management", href: "/admin/dashboard/teachers" },
  { label: "Students Management", href: "/admin/dashboard/students" },
  { label: "Classes Management", href: "/admin/dashboard/classes" },
  { label: "Sections Management", href: "/admin/dashboard/sections" },
  { label: "Subjects Management", href: "/admin/dashboard/subjects" },
  { label: "Lecture Slots Management", href: "/admin/dashboard/lecture-slots" },
  { label: "Live Classes Management", href: "/admin/dashboard/live-classes" },
  { label: "Timetables Management", href: "/admin/dashboard/timetables" },
  { label: "Accounts Management", href: "/admin/dashboard#accounts" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAuthGuard({ role: "Admin", loginPath: "/admin" });

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-slate-900 text-slate-100">
          <div className="px-6 py-6 text-xl font-semibold">LMS</div>
          <nav className="space-y-2 px-4 py-3">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-slate-100 transition hover:bg-slate-800"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Admin Panel
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Logout
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
