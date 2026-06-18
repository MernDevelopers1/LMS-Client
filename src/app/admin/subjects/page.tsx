"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  fetchSubjects,
  deleteSubject,
  setSelectedSubject,
} from "../../../features/subject/subjectSlice";
import TableList from "../../../components/TableList";

const columns = [
  { label: "Code", key: "code" },
  { label: "Name", key: "name" },
  { label: "Total Marks", key: "totalMarks" },
  { label: "Passing Marks", key: "passingMarks" },
];

export default function SubjectListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { subjects, status, error } = useAppSelector((state) => state.subject);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleEdit = (subject: any) => {
    dispatch(setSelectedSubject(subject));
    router.push(`/admin/subjects/${subject.id}`);
  };

  const handleDelete = async (subject: any) => {
    if (!window.confirm(`Delete subject "${subject.name}" (${subject.code})?`)) {
      return;
    }
    const result = await dispatch(deleteSubject(subject.id));
    if (deleteSubject.rejected.match(result)) {
      alert(`Cannot delete subject: ${result.payload}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Subjects Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, and manage academic subjects with marks configuration.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/subjects/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Subject
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading subjects...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={subjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
