"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchTimetables,
  deleteTimetable,
  setSelectedTimetable,
} from "../../../../features/timetable/timetableSlice";
import TableList from "../../../../components/TableList";

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
  { label: "Subject", key: "subjectName" },
  { label: "Teacher", key: "teacherName" },
  { label: "Lecture Slot", key: "lectureSlotTitle" },
  { label: "Day", key: "dayOfWeek" },
];

export default function TimetableListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { timetables, status, error } = useAppSelector(
    (state) => state.timetable,
  );

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const handleEdit = (timetable: any) => {
    dispatch(setSelectedTimetable(timetable));
    router.push(`/admin/dashboard/timetables/${timetable.id}`);
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

  const displayTimetables = timetables.map((t) => ({
    ...t,
    dayOfWeek: DAYS_OF_WEEK[t.dayOfWeek] || `Day ${t.dayOfWeek}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Timetable Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit, and manage timetable entries for classes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/timetables/new")}
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Add Timetable Entry
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading timetables...
        </div>
      ) : (
        <TableList
          columns={columns}
          data={displayTimetables}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
