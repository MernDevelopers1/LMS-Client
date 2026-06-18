"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchLiveClasses,
  deleteLiveClass,
  setSelectedLiveClass,
} from "../../../../features/liveClass/liveClassSlice";
import AdminListPage from "../../../../components/AdminListPage";

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
    router.push(`/admin/dashboard/live-classes/${liveClass.id}/edit`);
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
    <AdminListPage
      title="Live Classes Management"
      description="Create, edit, and manage live class sessions for your school."
      actionLabel="Add Live Class"
      actionHref="/admin/dashboard/live-classes/new"
      error={error}
      tableProps={{
        columns,
        data: liveClasses,
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
        onRowClick: (item: any) => {
          dispatch(setSelectedLiveClass(item));
          router.push(`/admin/dashboard/live-classes/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
