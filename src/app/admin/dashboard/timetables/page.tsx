"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchTimetables,
  deleteTimetable,
  setSelectedTimetable,
} from "../../../../features/timetable/timetableSlice";
import AdminListPage from "../../../../components/AdminListPage";

const DAYS_OF_WEEK: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const columns = [
  { label: "Class", key: "className" },
  { label: "Section", key: "sectionName" },
  { label: "Subject", key: "subjectName" },
  { label: "Teacher", key: "teacherName" },
  { label: "Lecture Slot", key: "lectureSlotTitle" },
  { label: "Day", key: "dayOfWeek" },
];

export default function TimetableListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { timetables, status, error, pagination } = useAppSelector(
    (state) => state.timetable,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("className");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchTimetables({
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

  const handleEdit = (timetable: any) => {
    dispatch(setSelectedTimetable(timetable));
    router.push(`/admin/dashboard/timetables/${timetable.id}/edit`);
  };

  const handleDelete = async (timetable: any) => {
    const dayName =
      DAYS_OF_WEEK[timetable.dayOfWeek] || `Day ${timetable.dayOfWeek}`;
    if (
      !window.confirm(
        `Delete timetable entry for ${timetable.subjectName} on ${dayName}?`,
      )
    ) {
      return;
    }
    const result = await dispatch(deleteTimetable(timetable.id));
    if (deleteTimetable.rejected.match(result)) {
      alert(`Cannot delete timetable: ${result.payload}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const displayTimetables = timetables.map((t) => ({
    ...t,
    dayOfWeek: DAYS_OF_WEEK[t.dayOfWeek] || `Day ${t.dayOfWeek}`,
  }));

  return (
    <AdminListPage
      title="Timetable Management"
      description="Create, edit, and manage timetable entries for classes."
      actionLabel="Add Timetable Entry"
      actionHref="/admin/dashboard/timetables/new"
      error={error}
      tableProps={{
        columns,
        data: displayTimetables,
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
          dispatch(setSelectedTimetable(item));
          router.push(`/admin/dashboard/timetables/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
