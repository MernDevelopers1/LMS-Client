"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchSections,
  deleteSection,
  setSelectedSection,
} from "../../../../features/section/sectionSlice";
import AdminListPage from "../../../../components/AdminListPage";

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
    <AdminListPage
      title="Sections Management"
      description="Create, edit, and manage sections for classes."
      actionLabel="Add Section"
      actionHref="/admin/dashboard/sections/new"
      error={error}
      tableProps={{
        columns,
        data: sections,
        currentPage,
        pageSize,
        totalItems: pagination.total,
        searchText: searchQuery,
        onSearchChange: handleSearch,
        onPageChange: setCurrentPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        onSortChange: handleSort,
        sortKey: sortBy,
        sortDirection: sortOrder,
        onEdit: handleEdit,
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
