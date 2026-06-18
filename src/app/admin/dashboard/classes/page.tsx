"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchClasses,
  deleteClass,
  setSelectedClass,
} from "../../../../features/class/classSlice";
import AdminListPage from "../../../../components/AdminListPage";

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
    <AdminListPage
      title="Class Management"
      description="Create, edit, and remove classes from the system."
      actionLabel="Add Class"
      actionHref="/admin/dashboard/classes/new"
      error={error}
      tableProps={{
        columns,
        data: classes,
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
