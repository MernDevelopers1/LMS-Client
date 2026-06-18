"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchSubjects,
  deleteSubject,
  setSelectedSubject,
} from "../../../../features/subject/subjectSlice";
import AdminListPage from "../../../../components/AdminListPage";

const columns = [
  { label: "Code", key: "code" },
  { label: "Subject", key: "name" },
  { label: "Total Marks", key: "totalMarks" },
  { label: "Passing Marks", key: "passingMarks" },
];

export default function SubjectListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { subjects, status, error, pagination } = useAppSelector(
    (state) => state.subject,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchSubjects({
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

  const handleEdit = (subject: any) => {
    dispatch(setSelectedSubject(subject));
    router.push(`/admin/dashboard/subjects/${subject.id}/edit`);
  };

  const handleDelete = async (subject: any) => {
    if (
      !window.confirm(`Delete subject "${subject.name}" (${subject.code})?`)
    ) {
      return;
    }
    const result = await dispatch(deleteSubject(subject.id));
    if (deleteSubject.rejected.match(result)) {
      alert(`Cannot delete subject: ${result.payload}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AdminListPage
      title="Subjects Management"
      description="Create, edit, and manage academic subjects with marks configuration."
      actionLabel="Add Subject"
      actionHref="/admin/dashboard/subjects/new"
      error={error}
      tableProps={{
        columns,
        data: subjects,
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
          dispatch(setSelectedSubject(item));
          router.push(`/admin/dashboard/subjects/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
