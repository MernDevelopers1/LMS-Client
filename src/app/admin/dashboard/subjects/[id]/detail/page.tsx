"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchSubjectById,
  clearSelectedSubject,
} from "@/features/subject/subjectSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function SubjectDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedSubject, status } = useAppSelector((s) => s.subject);

  useEffect(() => {
    if (id) dispatch(fetchSubjectById(id));
    return () => dispatch(clearSelectedSubject());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedSubject) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">Code: {selectedSubject.code}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedSubject.name}
        subtitle="Subject"
        status="active"
        statusColor="green"
        headerInfo={[
          { label: "Total Marks", value: String(selectedSubject.totalMarks) },
        ]}
        actionButton={
          <Button href={`/admin/dashboard/subjects/${selectedSubject.id}/edit`}>
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
