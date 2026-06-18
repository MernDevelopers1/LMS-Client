"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchClassById,
  clearSelectedClass,
} from "@/features/class/classSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedClass, status } = useAppSelector((s) => s.class);

  useEffect(() => {
    if (id) dispatch(fetchClassById(id));
    return () => dispatch(clearSelectedClass());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedClass) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">{selectedClass.description}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedClass.name}
        subtitle="Class"
        status="active"
        statusColor="green"
        headerInfo={[
          {
            label: "Academic Year",
            value: selectedClass.academicYearTitle || "-",
          },
        ]}
        actionButton={
          <Button href={`/admin/dashboard/classes/${selectedClass.id}/edit`}>
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
