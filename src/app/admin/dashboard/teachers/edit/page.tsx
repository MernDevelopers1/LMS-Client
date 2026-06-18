"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import useAuthGuard from "../../../../../hooks/useAuthGuard";
import {
  fetchTeacherById,
  updateTeacher,
  clearSelectedTeacher,
} from "../../../../../features/teacher/teacherSlice";
import TeacherForm from "../../../../../components/TeacherForm";
import DashboardLayout from "../../../../../components/dashboard/DashboardLayout";

const sidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Teachers Management", href: "/admin/dashboard/teachers" },
  { label: "Students Management", href: "/admin/dashboard#students" },
  { label: "Class Management", href: "/admin/dashboard#classes" },
  { label: "Accounts Management", href: "/admin/dashboard#accounts" },
];

export default function EditTeacherPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAuthGuard({ role: "Admin", loginPath: "/admin" });
  const params = useParams();
  const teacherId = Number((params?.id as string) || "0");
  const { selectedTeacher, status, error } = useAppSelector(
    (state) => state.teacher,
  );

  useEffect(() => {
    if (!selectedTeacher && teacherId) {
      dispatch(fetchTeacherById(teacherId));
    }

    return () => {
      dispatch(clearSelectedTeacher());
    };
  }, [dispatch, selectedTeacher, teacherId]);

  const handleSubmit = async (values: any) => {
    if (!teacherId) return;
    const result = await dispatch(updateTeacher({ id: teacherId, ...values }));
    if (updateTeacher.fulfilled.match(result)) {
      router.push("/admin/dashboard/teachers");
    }
  };

  if (!auth.initialized || auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        Loading...
      </div>
    );
  }

  if (status === "loading" && !selectedTeacher) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} headerTitle="Edit Teacher">
        <div className="p-8 text-slate-600">Loading teacher details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Edit Teacher">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit Teacher
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update teacher profile or account details.
          </p>
        </div>
        {selectedTeacher ? (
          <TeacherForm
            initialValues={{
              firstName: selectedTeacher.firstName,
              lastName: selectedTeacher.lastName,
              email: selectedTeacher.email,
              password: "",
              phone: selectedTeacher.phone || "",
              employeeNo: selectedTeacher.employeeNo || "",
              designation: selectedTeacher.designation || "",
              qualification: selectedTeacher.qualification || "",
              joiningDate: selectedTeacher.joiningDate || "",
              address: selectedTeacher.address || "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            status={status}
            error={error}
            showPassword={true}
          />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            Teacher not found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
