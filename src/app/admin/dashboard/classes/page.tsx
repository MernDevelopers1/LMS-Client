"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchClasses,
  deleteClass,
  setSelectedClass,
} from "../../../../features/class/classSlice";
import TableList from "../../../../components/TableList";

const columns = [
  { label: "Name", key: "name" },
  { label: "Academic Year", key: "academicYearTitle" },
  { label: "Description", key: "description" },
];

export default function ClassListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { classes, status, error } = useAppSelector((state) => state.class);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleEdit = (classItem: any) => {
    dispatch(setSelectedClass(classItem));
    router.push(`/admin/dashboard/classes/${classItem.id}`);
  };

  const handleDelete = async (classItem: any) => {
    if (!window.confirm(`Delete class "${classItem.name}"?`)) {
      return;
    }
    const result = await dispatch(deleteClass(classItem.id));
    if (deleteClass.rejected.match(result)) {
      alert(`Cannot delete class: ${result.payload}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Class Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, and remove classes from the system.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/classes/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading classes...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={classes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
