"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchSectionById,
  clearSelectedSection,
} from "@/features/section/sectionSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function SectionDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedSection, status } = useAppSelector((s) => s.section);

  useEffect(() => {
    if (id) dispatch(fetchSectionById(id));
    return () => dispatch(clearSelectedSection());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedSection) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">{selectedSection.description}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedSection.name}
        subtitle="Section"
        status="active"
        statusColor="green"
        headerInfo={[
          { label: "Capacity", value: String(selectedSection.capacity) },
        ]}
        actionButton={
          <Button href={`/admin/dashboard/sections/${selectedSection.id}/edit`}>
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
