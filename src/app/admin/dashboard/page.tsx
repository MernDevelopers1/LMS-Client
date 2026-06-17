"use client";

import useAuthGuard from "../../../hooks/useAuthGuard";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardPanel from "../../../components/dashboard/DashboardPanel";
import DashboardSummary from "../../../components/dashboard/DashboardSummary";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Students Management", href: "/admin/dashboard#students" },
  { label: "Class Management", href: "/admin/dashboard#classes" },
  { label: "Accounts Management", href: "/admin/dashboard#accounts" },
];

const summaryStats = [
  { value: 9, label: "Total Classes" },
  { value: 1, label: "Total Teachers" },
  { value: 3, label: "Total Students" },
];

const moduleCards = [
  { value: 12, label: "Unpaid Amount" },
  { value: 25, label: "Income Today" },
  { value: 144, label: "Expense Today" },
  { value: 2000, label: "Profit Today" },
];

export default function AdminDashboard() {
  const auth = useAuthGuard({ role: "Admin", loginPath: "/admin" });

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Admin Dashboard">
      <DashboardHeader
        schoolName="Apex International School, Elite Campus"
        dateLabel="17, June 2026"
      />
      <DashboardSummary title="Quick Overview" stats={summaryStats} />
      <DashboardPanel title="Financial Overview" data={moduleCards} />
    </DashboardLayout>
  );
}
