"use client";

import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardPanel from "../../../components/dashboard/DashboardPanel";
import DashboardSummary from "../../../components/dashboard/DashboardSummary";

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
  return (
    <div className="space-y-6">
      <DashboardHeader
        schoolName="Apex International School, Elite Campus"
        dateLabel="17, June 2026"
      />
      <DashboardSummary title="Quick Overview" stats={summaryStats} />
      <DashboardPanel title="Financial Overview" data={moduleCards} />
    </div>
  );
}
