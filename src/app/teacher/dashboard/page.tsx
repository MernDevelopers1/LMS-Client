"use client";

import useAuthGuard from "../../../hooks/useAuthGuard";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardPanel from "../../../components/dashboard/DashboardPanel";
import DashboardSummary from "../../../components/dashboard/DashboardSummary";

const sidebarItems = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Attendance", href: "/teacher/dashboard#attendance" },
  { label: "Class Management", href: "/teacher/dashboard#classes" },
];

const summaryStats = [
  { value: 7, label: "Total Classes" },
  { value: 4, label: "Subjects" },
  { value: 120, label: "Total Students" },
];

const moduleCards = [
  { value: 95, label: "Present Today" },
  { value: 15, label: "Absent Today" },
  { value: 8, label: "Late Today" },
  { value: 0, label: "Pending Requests" },
];

export default function TeacherDashboard() {
  const auth = useAuthGuard({ role: "Teacher", loginPath: "/teacher" });

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Teacher Dashboard">
      <DashboardHeader
        schoolName="Apex International School, Elite Campus"
        dateLabel="17, June 2026"
      />
      <DashboardSummary title="Quick Overview" stats={summaryStats} />
      <DashboardPanel title="Attendance & Stats" data={moduleCards} />
    </DashboardLayout>
  );
}
