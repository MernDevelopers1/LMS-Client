"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchTimetableById,
  updateTimetable,
  clearSelectedTimetable,
} from "../../../../../features/timetable/timetableSlice";
import TimetableForm from "../../../../../components/TimetableForm";

export default function EditTimetablePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const timetableId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedTimetable, status, error } = useAppSelector(
    (state) => state.timetable,
  );

  useEffect(() => {
    if (timetableId > 0) {
      dispatch(fetchTimetableById(timetableId));
    }
    return () => {
      dispatch(clearSelectedTimetable());
    };
  }, [dispatch, timetableId]);

  const handleSubmit = async (values: any) => {
    if (!timetableId) return;
    const result = await dispatch(
      updateTimetable({ id: timetableId, ...values }),
    );
    if (updateTimetable.fulfilled.match(result)) {
      router.push("/admin/dashboard/timetables");
    }
  };

  if (status === "loading" && !selectedTimetable) {
    return (
      <div className="p-8 text-slate-600">Loading timetable details...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Timetable Entry
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update timetable entry details.
        </p>
      </div>
      {selectedTimetable ? (
        <TimetableForm
          initialValues={{
            sectionId: selectedTimetable.sectionId ?? 0,
            subjectId: selectedTimetable.subjectId,
            teacherId: selectedTimetable.teacherId,
            roomId: selectedTimetable.roomId,
            lectureSlotId: selectedTimetable.lectureSlotId,
            dayOfWeek: selectedTimetable.dayOfWeek,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Timetable entry not found.
        </div>
      )}
    </div>
  );
}
