"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchTeacherById,
  clearSelectedTeacher,
} from "@/features/teacher/teacherSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedTeacher, status } = useAppSelector((s) => s.teacher);

  useEffect(() => {
    if (id) dispatch(fetchTeacherById(id));
    return () => dispatch(clearSelectedTeacher());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedTeacher) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">{selectedTeacher.email}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
        subtitle={selectedTeacher.designation}
        status={selectedTeacher.status}
        statusColor={selectedTeacher.status === "active" ? "green" : "red"}
        headerInfo={[
          { label: "Phone", value: selectedTeacher.phone || "-" },
          { label: "Email", value: selectedTeacher.email },
        ]}
        actionButton={
          <Button href={`/admin/dashboard/teachers/${selectedTeacher.id}/edit`}>
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
