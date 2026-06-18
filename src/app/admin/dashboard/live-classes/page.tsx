"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  fetchLiveClasses,
  deleteLiveClass,
  setSelectedLiveClass,
} from "../../../features/liveClass/liveClassSlice";
import TableList from "../../../components/TableList";

const columns = [
  { label: "Title", key: "title" },
  { label: "Section", key: "sectionName" },
  { label: "Class", key: "className" },
  { label: "Subject", key: "subjectName" },
  { label: "Teacher", key: "teacherName" },
  { label: "Start Time", key: "startTime" },
  { label: "Status", key: "status" },
];

export default function LiveClassListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { liveClasses, status, error } = useAppSelector((state) => state.liveClass);

  useEffect(() => {
    dispatch(fetchLiveClasses());
  }, [dispatch]);

  const handleEdit = (liveClass: any) => {
    dispatch(setSelectedLiveClass(liveClass));
    router.push(`/admin/dashboard/live-classes/${liveClass.id}`);
  };

  const handleDelete = async (liveClass: any) => {
    if (!window.confirm(`Delete live class "${liveClass.title}"?`)) {
      return;
    }
    const result = await dispatch(deleteLiveClass(liveClass.id));
    if (deleteLiveClass.rejected.match(result)) {
      alert(`Cannot delete live class: ${result.payload}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Live Classes Management</h1>
          <p className="text-sm text-slate-500">
            Create, edit, and manage live class sessions for your school.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/live-classes/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Live Class
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading live classes...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={liveClasses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

