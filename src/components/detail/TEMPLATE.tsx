/**
 * TEMPLATE: Teacher Detail Page
 *
 * This is a reusable template for creating detail pages for other modules.
 * Copy this file and adapt it for your module (replace 'teacher' with your module name).
 *
 * Usage:
 * 1. Copy this template to your module: src/app/admin/dashboard/[module]/[id]/page.tsx
 * 2. Replace 'teacher' with your module name throughout
 * 3. Replace mock data with real API calls
 * 4. Customize sections and tabs as needed
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../../features/teacher/teacherSlice";
import Button from "../../components/Button";
import {
  DetailPageHeader,
  DetailSection,
  DetailField,
  DetailPageTabs,
  DetailDataTable,
  type DetailPageTab,
} from "../../components/detail";

// Define types for related data
interface RelatedData {
  id: number;
  [key: string]: any;
}

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const teacherId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;

  const dispatch = useAppDispatch();
  const { selectedTeacher, status } = useAppSelector((state) => state.teacher);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock related data - Replace with actual API calls
  const [relatedData] = useState<RelatedData[]>([
    // Add your related data here
  ]);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherById(teacherId));
    }
  }, [dispatch, teacherId]);

  useEffect(() => {
    if (selectedTeacher) {
      setEditData(selectedTeacher);
    }
  }, [selectedTeacher]);

  const handleEdit = () => {
    if (editData) {
      dispatch(updateTeacher({ id: teacherId, ...editData }));
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      await dispatch(deleteTeacher(teacherId));
      router.push("/admin/dashboard/teachers");
    }
  };

  if (status === "loading") {
    return <div className="p-4">Loading teacher details...</div>;
  }

  if (!selectedTeacher) {
    return <div className="p-4">Teacher not found</div>;
  }

  // Define tabs
  const tabs: DetailPageTab[] = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="space-y-6">
          <DetailSection title="Personal Information" columns={2}>
            <DetailField
              label="First Name"
              value={selectedTeacher.firstName}
              editable={isEditing}
            />
            <DetailField
              label="Last Name"
              value={selectedTeacher.lastName}
              editable={isEditing}
            />
            <DetailField
              label="Email"
              value={selectedTeacher.email}
              type="email"
              editable={isEditing}
            />
            <DetailField
              label="Phone"
              value={selectedTeacher.phone}
              type="tel"
              editable={isEditing}
            />
          </DetailSection>

          <DetailSection title="Related Data">
            <DetailDataTable
              title="Example Table"
              columns={[
                { label: "Column 1", key: "column1" },
                { label: "Column 2", key: "column2" },
              ]}
              data={relatedData}
              emptyMessage="No related data available."
            />
          </DetailSection>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <DetailPageHeader
        title={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
        subtitle="Your subtitle here"
        status={selectedTeacher.status}
        statusColor={selectedTeacher.status === "active" ? "green" : "red"}
        headerInfo={[
          { label: "Email", value: selectedTeacher.email },
          { label: "Phone", value: selectedTeacher.phone || "-" },
          // Add more header info as needed
        ]}
        actionButton={
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button type="button" onClick={handleDelete} variant="danger">
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={handleEdit}>
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
