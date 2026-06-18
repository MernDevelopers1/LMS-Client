"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchLiveClassById,
  updateLiveClass,
  clearSelectedLiveClass,
} from "../../../../../features/liveClass/liveClassSlice";
import LiveClassForm from "../../../../../components/LiveClassForm";

function formatStartTime(value?: string) {
  if (!value) return "";
  return value.replace(" ", "T");
}

export default function EditLiveClassPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const liveClassId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedLiveClass, status, error } = useAppSelector(
    (state) => state.liveClass,
  );

  useEffect(() => {
    if (liveClassId > 0) {
      dispatch(fetchLiveClassById(liveClassId));
    }
    return () => {
      dispatch(clearSelectedLiveClass());
    };
  }, [dispatch, liveClassId]);

  const handleSubmit = async (values: any) => {
    if (!liveClassId) return;
    const result = await dispatch(
      updateLiveClass({ id: liveClassId, ...values }),
    );
    if (updateLiveClass.fulfilled.match(result)) {
      router.push("/admin/dashboard/live-classes");
    }
  };

  if (status === "loading" && !selectedLiveClass) {
    return (
      <div className="p-8 text-slate-600">Loading live class details...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Live Class
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update live class session details.
        </p>
      </div>
      {selectedLiveClass ? (
        <LiveClassForm
          initialValues={{
            sectionId: selectedLiveClass.sectionId,
            subjectId: selectedLiveClass.subjectId,
            teacherId: selectedLiveClass.teacherId,
            title: selectedLiveClass.title,
            description: selectedLiveClass.description || "",
            zoomMeetingId: selectedLiveClass.zoomMeetingId || "",
            zoomJoinUrl: selectedLiveClass.zoomJoinUrl || "",
            zoomStartUrl: selectedLiveClass.zoomStartUrl || "",
            startTime: formatStartTime(selectedLiveClass.startTime),
            durationMinutes: selectedLiveClass.durationMinutes,
            recordingUrl: selectedLiveClass.recordingUrl || "",
            status: selectedLiveClass.status,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Live class not found.
        </div>
      )}
    </div>
  );
}
