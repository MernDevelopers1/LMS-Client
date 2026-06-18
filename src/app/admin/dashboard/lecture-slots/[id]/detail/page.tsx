"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchLectureSlotById,
  clearSelectedLectureSlot,
} from "@/features/lectureSlot/lectureSlotSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function LectureSlotDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedLectureSlot, status } = useAppSelector((s) => s.lectureSlot);

  useEffect(() => {
    if (id) dispatch(fetchLectureSlotById(id));
    return () => dispatch(clearSelectedLectureSlot());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedLectureSlot) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="p-4">
          Start: {selectedLectureSlot.startTime}, End:{" "}
          {selectedLectureSlot.endTime}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedLectureSlot.title}
        subtitle="Lecture Slot"
        status="active"
        statusColor="green"
        headerInfo={[
          { label: "Start", value: selectedLectureSlot.startTime },
          { label: "End", value: selectedLectureSlot.endTime },
        ]}
        actionButton={
          <Button
            href={`/admin/dashboard/lecture-slots/${selectedLectureSlot.id}/edit`}
          >
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
