"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchTimetableById,
  clearSelectedTimetable,
} from "@/features/timetable/timetableSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function TimetableDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedTimetable, status } = useAppSelector((s) => s.timetable);

  useEffect(() => {
    if (id) dispatch(fetchTimetableById(id));
    return () => dispatch(clearSelectedTimetable());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedTimetable) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">{selectedTimetable.description}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedTimetable.name}
        subtitle="Timetable"
        status="active"
        statusColor="green"
        headerInfo={[{ label: "Term", value: selectedTimetable.term }]}
        actionButton={
          <Button
            href={`/admin/dashboard/timetables/${selectedTimetable.id}/edit`}
          >
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
