"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  fetchSections,
  deleteSection,
  setSelectedSection,
} from "../../../features/section/sectionSlice";
import TableList from "../../../components/TableList";

const columns = [
  { label: "Name", key: "name" },
  { label: "Class", key: "className" },
  { label: "Academic Year", key: "academicYearTitle" },
  { label: "Capacity", key: "capacity" },
];

export default function SectionListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sections, status, error } = useAppSelector((state) => state.section);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleEdit = (section: any) => {
    dispatch(setSelectedSection(section));
    router.push(`/admin/sections/${section.id}`);
  };

  const handleDelete = async (section: any) => {
    if (!window.confirm(`Delete section "${section.name}"?`)) {
      return;
    }
    const result = await dispatch(deleteSection(section.id));
    if (deleteSection.rejected.match(result)) {
      alert(`Cannot delete section: ${result.payload}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Sections Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, and manage sections for classes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/sections/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Section
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading sections...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={sections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
