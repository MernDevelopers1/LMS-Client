"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchTeachers,
  deleteTeacher,
  setSelectedTeacher,
} from "../../../../features/teacher/teacherSlice";
import AdminListPage from "../../../../components/AdminListPage";

const columns = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Employee No", key: "employeeNo" },
  { label: "Designation", key: "designation" },
  { label: "Status", key: "status" },
];

export default function TeacherListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { teachers, status, error, pagination } = useAppSelector(
    (state) => state.teacher,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchTeachers({
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

  const handleEdit = (teacher: any) => {
    dispatch(setSelectedTeacher(teacher));
    router.push(`/admin/dashboard/teachers/${teacher.id}/edit`);
  };

  const handleDelete = async (teacher: any) => {
    if (!window.confirm(`Delete ${teacher.firstName} ${teacher.lastName}?`)) {
      return;
    }
    const result = await dispatch(deleteTeacher(teacher.id));
    if (deleteTeacher.rejected.match(result)) {
      alert(`Cannot delete teacher: ${result.payload}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AdminListPage
      title="Teacher Management"
      description="Create, edit, and remove teachers from the system."
      actionLabel="Add Teacher"
      actionHref="/admin/dashboard/teachers/new"
      error={error}
      tableProps={{
        columns,
        data: teachers,
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
          dispatch(setSelectedTeacher(item));
          router.push(`/admin/dashboard/teachers/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
