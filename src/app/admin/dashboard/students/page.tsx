"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchStudents,
  deleteStudent,
  setSelectedStudent,
} from "../../../../features/student/studentSlice";
import AdminListPage from "../../../../components/AdminListPage";

const columns = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Registration No", key: "registrationNo" },
  { label: "Gender", key: "gender" },
  { label: "Status", key: "status" },
];

export default function StudentListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { students, status, error, pagination } = useAppSelector(
    (state) => state.student,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchStudents({
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

  const handleEdit = (student: any) => {
    dispatch(setSelectedStudent(student));
    router.push(`/admin/dashboard/students/${student.id}/edit`);
  };

  const handleDelete = async (student: any) => {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) {
      return;
    }
    const result = await dispatch(deleteStudent(student.id));
    if (deleteStudent.rejected.match(result)) {
      alert(`Cannot delete student: ${result.payload}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AdminListPage
      title="Student Management"
      description="Create, edit, and remove students from the system."
      actionLabel="Add Student"
      actionHref="/admin/dashboard/students/new"
      error={error}
      tableProps={{
        columns,
        data: students,
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
          dispatch(setSelectedStudent(item));
          router.push(`/admin/dashboard/students/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
