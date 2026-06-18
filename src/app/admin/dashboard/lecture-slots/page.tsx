"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AdminListPage from "@/components/AdminListPage";
import {
  fetchLectureSlots,
  deleteLectureSlot,
} from "@/features/lectureSlot/lectureSlotSlice";
import { AppDispatch, RootState } from "@/store/store";

const LectureSlotListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string | null>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { lectureSlots, status, error, pagination } = useSelector(
    (state: RootState) => state.lectureSlot,
  );

  useEffect(() => {
    dispatch(
      fetchLectureSlots({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sortBy: sortBy ?? undefined,
        sortOrder,
      }),
    );
  }, [dispatch, currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const handleDelete = async (id: number) => {
    await dispatch(deleteLectureSlot(id));
    setShowDeleteConfirm(null);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    const nextSortOrder =
      sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(key);
    setSortOrder(nextSortOrder);
    setCurrentPage(1);
  };

  const displayLectureSlots = useMemo(
    () =>
      lectureSlots.map((slot) => {
        const start = new Date(`2000-01-01 ${slot.startTime}`);
        const end = new Date(`2000-01-01 ${slot.endTime}`);
        const durationMinutes = Math.round(
          (end.getTime() - start.getTime()) / 60000,
        );
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        return {
          ...slot,
          duration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
        };
      }),
    [lectureSlots],
  );

  if (status === "loading" && lectureSlots.length === 0) {
    return <div className="p-4">Loading lecture slots...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminListPage
        title="Lecture Slots Management"
        description="Manage the lecture slot schedule and timings."
        actionLabel="Add Lecture Slot"
        actionHref="/admin/dashboard/lecture-slots/new"
        error={error}
        tableProps={{
          columns: [
            { label: "Title", key: "title" },
            { label: "Start Time", key: "startTime" },
            { label: "End Time", key: "endTime" },
            { label: "Duration", key: "duration" },
          ],
          data: displayLectureSlots,
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
          remoteSort: true,
          sortKey: sortBy,
          sortDirection: sortOrder,
          onEdit: (item: any) =>
            router.push(`/admin/dashboard/lecture-slots/${item.id}/edit`),
          onRowClick: (item: any) =>
            router.push(`/admin/dashboard/lecture-slots/${item.id}/detail`),
          onDelete: (item: any) => setShowDeleteConfirm(item.id),
          isLoading: status === "loading",
        }}
      />

      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="mb-4 text-slate-700">
              Are you sure you want to delete this lecture slot?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureSlotListPage;
