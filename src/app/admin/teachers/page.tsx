"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import useAuthGuard from "../../../hooks/useAuthGuard";
import {
  fetchTeachers,
  deleteTeacher,
  setSelectedTeacher,
} from "../../../features/teacher/teacherSlice";
import TableList from "../../../components/TableList";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Teachers Management", href: "/admin/teachers" },
  { label: "Students Management", href: "/admin/dashboard#students" },
  { label: "Class Management", href: "/admin/dashboard#classes" },
  { label: "Accounts Management", href: "/admin/dashboard#accounts" },
];

const columns = [
  { label: "Name", key: "firstName" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Employee No", key: "employeeNo" },
  { label: "Designation", key: "designation" },
  { label: "Status", key: "status" },
];

export default function TeacherListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAuthGuard({ role: "Admin", loginPath: "/admin" });
  const { teachers, status, error } = useAppSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleEdit = (teacher: any) => {
    dispatch(setSelectedTeacher(teacher));
    router.push(`/admin/teachers/${teacher.id}`);
  };

  const handleDelete = async (teacher: any) => {
    if (!window.confirm(`Delete ${teacher.firstName} ${teacher.lastName}?`)) {
      return;
    }
    const result = await dispatch(deleteTeacher(teacher.id));
    if (deleteTeacher.rejected.match(result)) {
      alert(`Cannot delete teacher: ${result.payload}`);
    }
  };

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Teacher Management
            </h1>
            <p className="text-sm text-slate-500">
              Create, edit, and remove teachers from the system.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/teachers/new")}
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Add Teacher
          </button>
        </div>

        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Loading teachers...
          </div>
        ) : (
          <TableList
            columns={columns}
            data={teachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
