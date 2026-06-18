"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchLiveClasses,
  deleteLiveClass,
  setSelectedLiveClass,
} from "../../../../features/liveClass/liveClassSlice";
import TableList from "../../../../components/TableList";

const columns = [
  { label: "Class", key: "className" },
  { label: "Section", key: "sectionName" },
  { label: "Subject", key: "subjectName" },
  { label: "Teacher", key: "teacherName" },
  { label: "Start Time", key: "startTime" },
  { label: "Status", key: "status" },
];

export default function LiveClassListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { liveClasses, status, error, pagination } = useAppSelector(
    (state) => state.liveClass,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchLiveClasses({
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Live Classes Management
          </h1>
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

      <TableList
        columns={columns}
        data={liveClasses}
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
