"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchClasses,
  deleteClass,
  setSelectedClass,
} from "../../../../features/class/classSlice";
import TableList from "../../../../components/TableList";

const columns = [
  { label: "Class", key: "name" },
  { label: "Academic Year", key: "academicYearTitle" },
  { label: "Description", key: "description" },
];

export default function ClassListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { classes, status, error, pagination } = useAppSelector(
    (state) => state.class,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchClasses({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sortBy: sortBy ?? undefined,
        sortOrder,
      }),
    );
  }, [dispatch, currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    const nextSortOrder =
      sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(key);
    setSortOrder(nextSortOrder);
    setCurrentPage(1);
  };

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
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

      <TableList
        columns={columns}
        data={classes}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={pagination.total}
        searchText={searchQuery}
        onSearchChange={handleSearch}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        onSortChange={handleSort}
        sortKey={sortBy}
        sortDirection={sortOrder}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={status === "loading"}
      />
    </div>
  );
}
