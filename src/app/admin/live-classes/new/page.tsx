"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { createLiveClass } from "../../../../features/liveClass/liveClassSlice";
import LiveClassForm from "../../../../components/LiveClassForm";

export default function NewLiveClassPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.liveClass);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createLiveClass(values));
    if (createLiveClass.fulfilled.match(result)) {
      router.push("/admin/live-classes");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Add Live Class</h1>
        <p className="mt-2 text-sm text-slate-500">
          Schedule a new live class session for a class section.
        </p>
      </div>
      <LiveClassForm
        initialValues={{
          sectionId: 0,
          subjectId: 0,
          teacherId: 0,
          title: "",
          description: "",
          zoomMeetingId: "",
          zoomJoinUrl: "",
          zoomStartUrl: "",
          startTime: "",
          durationMinutes: 45,
          recordingUrl: "",
          status: "scheduled",
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Live Class"
        status={status}
        error={error}
      />
    </div>
  );
}
