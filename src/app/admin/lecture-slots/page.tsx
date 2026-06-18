"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchLectureSlots,
  deleteLectureSlot,
} from "@/features/lectureSlot/lectureSlotSlice";
import { AppDispatch, RootState } from "@/store/store";

const LectureSlotListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { lectureSlots, status, error, pagination } = useSelector(
    (state: RootState) => state.lectureSlot
  );

  useEffect(() => {
    dispatch(
      fetchLectureSlots({
        page: currentPage,
        limit: 20,
        search: searchQuery,
      })
    );
  }, [dispatch, currentPage, searchQuery]);

  const handleDelete = async (id: number) => {
    await dispatch(deleteLectureSlot(id));
    setShowDeleteConfirm(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (status === "loading" && lectureSlots.length === 0) {
    return <div className="p-4">Loading lecture slots...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lecture Slots Management</h1>
        <Link
          href="/admin/lecture-slots/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Lecture Slot
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {lectureSlots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No lecture slots found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Start Time
                </th>
                <th className="text-left py-3 px-4 font-semibold">End Time</th>
                <th className="text-left py-3 px-4 font-semibold">Duration</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectureSlots.map((slot) => {
                // Calculate duration
                const start = new Date(`2000-01-01 ${slot.startTime}`);
                const end = new Date(`2000-01-01 ${slot.endTime}`);
                const durationMinutes = Math.round(
                  (end.getTime() - start.getTime()) / 60000
                );
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const durationStr =
                  hours > 0
                    ? `${hours}h ${minutes}m`
                    : `${minutes}m`;

                return (
                  <tr key={slot.id} className="border-b border-slate-200">
                    <td className="py-3 px-4">{slot.title}</td>
                    <td className="py-3 px-4">{slot.startTime}</td>
                    <td className="py-3 px-4">{slot.endTime}</td>
                    <td className="py-3 px-4">{durationStr}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/lecture-slots/${slot.id}`}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(slot.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      {showDeleteConfirm === slot.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg">
                            <p className="mb-4">
                              Are you sure you want to delete this lecture slot?
                            </p>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDelete(slot.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LectureSlotListPage;
