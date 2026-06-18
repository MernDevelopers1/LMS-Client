"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import { createTimetable } from "../../../../../features/timetable/timetableSlice";
import TimetableForm from "../../../../../components/TimetableForm";

export default function NewTimetablePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.timetable);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createTimetable(values));
    if (createTimetable.fulfilled.match(result)) {
      router.push("/admin/dashboard/timetables");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add Timetable Entry
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new timetable entry for a class session.
        </p>
      </div>
      <TimetableForm
        initialValues={{
          sectionId: 0,
          subjectId: 0,
          teacherId: 0,
          roomId: undefined,
          lectureSlotId: 0,
          dayOfWeek: 0,
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Timetable Entry"
        status={status}
        error={error}
      />
    </div>
  );
}
