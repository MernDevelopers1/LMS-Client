"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchStudents,
  deleteStudent,
  setSelectedStudent,
} from "../../../../features/student/studentSlice";
import TableList from "../../../../components/TableList";

const columns = [
  { label: "Name", key: "firstName" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Registration No", key: "registrationNo" },
  { label: "Gender", key: "gender" },
  { label: "Status", key: "status" },
];

export default function StudentListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { students, status, error } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleEdit = (student: any) => {
    dispatch(setSelectedStudent(student));
    router.push(`/admin/dashboard/students/${student.id}`);
  };

  const handleDelete = async (student: any) => {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }
    const result = await dispatch(deleteStudent(student.id));
    if (deleteStudent.rejected.match(result)) {
      alert(`Cannot delete student: ${result.payload}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Student Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, and remove students from the system.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/students/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading students...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
