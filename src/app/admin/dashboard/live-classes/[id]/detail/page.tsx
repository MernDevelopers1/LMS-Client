"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchLiveClassById,
  clearSelectedLiveClass,
} from "@/features/liveClass/liveClassSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function LiveClassDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedLiveClass, status } = useAppSelector((s) => s.liveClass);

  useEffect(() => {
    if (id) dispatch(fetchLiveClassById(id));
    return () => dispatch(clearSelectedLiveClass());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedLiveClass) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">{selectedLiveClass.title}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedLiveClass.title}
        subtitle="Live Class"
        status={selectedLiveClass.status}
        statusColor={selectedLiveClass.status === "active" ? "green" : "red"}
        headerInfo={[{ label: "Start", value: selectedLiveClass.startTime }]}
        actionButton={
          <Button
            href={`/admin/dashboard/live-classes/${selectedLiveClass.id}/edit`}
          >
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
