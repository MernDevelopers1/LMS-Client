"use client";

import Link from "next/link";
import DashboardPanel from "../../../components/dashboard/DashboardPanel";

const summaryStats = [
  { value: 128, label: "Total Students" },
  { value: 24, label: "Total Teachers" },
  { value: 18, label: "Active Classes" },
];

const moduleCards = [
  { value: 42, label: "Upcoming Lectures" },
  { value: 128, label: "Assigned Rooms" },
  { value: 34, label: "Active Sections" },
  { value: 15, label: "Pending Timetables" },
];

const academicLinks = [
  { label: "Classes", href: "/admin/dashboard/classes" },
  { label: "Sections", href: "/admin/dashboard/sections" },
  { label: "Subjects", href: "/admin/dashboard/subjects" },
  { label: "Lecture Slots", href: "/admin/dashboard/lecture-slots" },
  { label: "Live Classes", href: "/admin/dashboard/live-classes" },
  { label: "Rooms", href: "/admin/dashboard/rooms" },
  { label: "Timetables", href: "/admin/dashboard/timetables" },
];

const peopleLinks = [
  { label: "Teachers", href: "/admin/dashboard/teachers" },
  { label: "Students", href: "/admin/dashboard/students" },
  { label: "Accounts", href: "/admin/dashboard#accounts" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Academic hub
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Manage your academic operations
              </h2>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Today
              <div className="mt-1 text-xl font-semibold text-slate-900">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            Use the quick links and analytics panels to access academic modules
            faster. Search or filter records from any table page directly.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Quick Stats
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {summaryStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Actions</h3>
            <div className="mt-6 grid gap-3">
              {peopleLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Academic Modules
            </h2>
            <p className="text-sm text-slate-500">
              All operational modules are now grouped under Academic.
            </p>
          </div>
          <Link
            href="/admin/dashboard/classes"
            className="rounded-3xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Open Academic Hub
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {academicLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                {link.label}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Open the {link.label.toLowerCase()} management page.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <DashboardPanel title="Operational Overview" data={moduleCards} />
    </div>
  );
}
