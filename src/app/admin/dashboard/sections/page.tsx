"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchSections,
  deleteSection,
  setSelectedSection,
} from "../../../../features/section/sectionSlice";
import TableList from "../../../../components/TableList";

const columns = [
  { label: "Section", key: "name" },
  { label: "Class", key: "className" },
  { label: "Academic Year", key: "academicYearTitle" },
  { label: "Capacity", key: "capacity" },
];

export default function SectionListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sections, status, error, pagination } = useAppSelector(
    (state) => state.section,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchSections({
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

  const handleEdit = (section: any) => {
    dispatch(setSelectedSection(section));
    router.push(`/admin/dashboard/sections/${section.id}`);
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
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
          onClick={() => router.push("/admin/dashboard/sections/new")}
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

      <TableList
        columns={columns}
        data={sections}
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
