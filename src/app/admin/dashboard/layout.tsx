"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../hooks";
import { logoutUser } from "../../../features/auth/authSlice";
import useAuthGuard from "../../../hooks/useAuthGuard";
import TopBar from "../../../components/TopBar";
import Sidebar, { SidebarSection } from "../../../components/Sidebar";
import SidebarSubMenu from "../../../components/SidebarSubMenu";

const sidebarSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard" }],
  },
  {
    title: "Academic",
    childItems: [
      { label: "Classes", href: "/admin/dashboard/classes" },
      { label: "Sections", href: "/admin/dashboard/sections" },
      { label: "Subjects", href: "/admin/dashboard/subjects" },
      { label: "Lecture Slots", href: "/admin/dashboard/lecture-slots" },
      { label: "Live Classes", href: "/admin/dashboard/live-classes" },
      { label: "Rooms", href: "/admin/dashboard/rooms" },
      { label: "Timetables", href: "/admin/dashboard/timetables" },
    ],
  },
  {
    title: "People",
    childItems: [
      { label: "Teachers", href: "/admin/dashboard/teachers" },
      { label: "Students", href: "/admin/dashboard/students" },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Accounts", href: "/admin/dashboard#accounts" }],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAuthGuard({ role: "Admin", loginPath: "/admin" });
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);

  const activeSection = sidebarSections.find(
    (section) => section.title === activeSidebar,
  );

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/admin");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarWrapperRef.current &&
        !sidebarWrapperRef.current.contains(event.target as Node)
      ) {
        setActiveSidebar(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <TopBar />

      <div className="flex flex-1 ml-80 pt-16" ref={rootRef}>
        <div className="relative" ref={sidebarWrapperRef}>
          <Sidebar
            sections={sidebarSections}
            activeSection={activeSidebar}
            onSectionToggle={(title) =>
              setActiveSidebar(activeSidebar === title ? null : title)
            }
            onLogout={handleLogout}
          />

          <SidebarSubMenu
            activeSection={activeSection}
            onClose={() => setActiveSidebar(null)}
          />
        </div>

        <main className="flex-1 p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
