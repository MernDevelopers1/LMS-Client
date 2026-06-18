"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  fetchStudentById,
  updateStudent,
  deleteStudent,
} from "../../../../../../features/student/studentSlice";
import Button from "../../../../../../components/Button";
import {
  DetailPageHeader,
  DetailSection,
  DetailField,
  DetailPageTabs,
  DetailDataTable,
  type DetailPageTab,
  type DetailDataTableColumn,
} from "../../../../../../components/detail";

// Mock interfaces for related data
interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  occupation: string;
  workPlace: string;
}

interface EducationRecord {
  id: number;
  institution: string;
  level: string;
  passingYear: number;
  percentage: number;
  board: string;
}

interface DocumentRecord {
  id: number;
  documentType: string;
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: string;
  remarks: string;
}

interface AssetRecord {
  id: number;
  assetType: string;
  assetNumber: string;
  issueDate: string;
  status: string;
}

interface LeaveRecord {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

interface DeviceRecord {
  id: number;
  deviceType: string;
  deviceNumber: string;
  assignedDate: string;
  status: string;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const studentId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;

  const dispatch = useAppDispatch();
  const { selectedStudent, status } = useAppSelector(
    (state) => state.student,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Mock data for related records
  const [familyMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: "Muhammad Atique",
      relationship: "Father",
      phone: "+92 321-7232650",
      occupation: "Driver",
      workPlace: "Karachi",
    },
    {
      id: 2,
      name: "Saima Sultana",
      relationship: "Mother",
      phone: "+92 300-1234567",
      occupation: "House Wife",
      workPlace: "-",
    },
    {
      id: 3,
      name: "Muhammad Shafique",
      relationship: "Brother",
      phone: "+92 321-7232650",
      occupation: "Student",
      workPlace: "-",
    },
    {
      id: 4,
      name: "Iftikhar Munir",
      relationship: "Brother",
      phone: "+92 321-1234567",
      occupation: "Student",
      workPlace: "-",
    },
  ]);

  const [educationRecords] = useState<EducationRecord[]>([
    {
      id: 1,
      institution: "University of Agriculture Faisalabad",
      level: "BS(CS)",
      passingYear: 2022,
      percentage: 3.5,
      board: "UAF",
    },
    {
      id: 2,
      institution: "Govt Post Graduate Collage",
      level: "Intermediate",
      passingYear: 2019,
      percentage: 81,
      board: "FBISE",
    },
    {
      id: 3,
      institution: "Govt MC Model High School",
      level: "Matric",
      passingYear: 2017,
      percentage: 85,
      board: "FBISE",
    },
  ]);

  const [documentRecords] = useState<DocumentRecord[]>([
    {
      id: 1,
      documentType: "CNIC",
      documentNumber: "35202-7652693-5",
      issuedDate: "2020-01-15",
      expiryDate: "2025-01-15",
      status: "Valid",
    },
  ]);

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { id: 1, date: "2024-06-18", status: "Present", remarks: "" },
    { id: 2, date: "2024-06-17", status: "Present", remarks: "" },
    { id: 3, date: "2024-06-16", status: "Absent", remarks: "Leave" },
  ]);

  const [assetRecords] = useState<AssetRecord[]>([
    {
      id: 1,
      assetType: "Laptop",
      assetNumber: "LT-001",
      issueDate: "2023-09-01",
      status: "Assigned",
    },
  ]);

  const [leaveRecords] = useState<LeaveRecord[]>([
    {
      id: 1,
      leaveType: "Casual Leave",
      startDate: "2024-06-16",
      endDate: "2024-06-16",
      status: "Approved",
      reason: "Medical",
    },
  ]);

  const [deviceRecords] = useState<DeviceRecord[]>([
    {
      id: 1,
      deviceType: "Smart Card",
      deviceNumber: "SC-12345",
      assignedDate: "2023-09-01",
      status: "Active",
    },
  ]);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (selectedStudent) {
      setEditData(selectedStudent);
    }
  }, [selectedStudent]);

  const handleEdit = () => {
    if (editData) {
      dispatch(updateStudent({ id: studentId, ...editData }));
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await dispatch(deleteStudent(studentId));
      router.push("/admin/dashboard/students");
    }
  };

  if (status === "loading") {
    return <div className="p-4">Loading student details...</div>;
  }

  if (!selectedStudent) {
    return <div className="p-4">Student not found</div>;
  }

  const profileInitials = `${selectedStudent.firstName?.[0] || ""}${
    selectedStudent.lastName?.[0] || ""
  }`.toUpperCase();

  const tabs: DetailPageTab[] = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="space-y-6">
          <DetailSection title="Personal Information" columns={2}>
            <DetailField
              label="Father's Name"
              value="Munir Ahmad"
              editable={isEditing}
            />
            <DetailField
              label="Mother's Name"
              value="Saima Sultana"
              editable={isEditing}
            />
            <DetailField
              label="Place of Birth"
              value="Wazirabad"
              editable={isEditing}
            />
            <DetailField
              label="Religion"
              value="Islam"
              editable={isEditing}
            />
            <DetailField
              label="Blood Group"
              value="B+"
              editable={isEditing}
            />
            <DetailField
              label="Marital Status"
              value="Single"
              editable={isEditing}
            />
          </DetailSection>

          <DetailSection title="Emergency Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Primary</h4>
                <div className="space-y-4">
                  <DetailField
                    label="Name"
                    value="Muhammad Shafique"
                    editable={isEditing}
                  />
                  <DetailField
                    label="Relationship"
                    value="Brother"
                    editable={isEditing}
                  />
                  <DetailField
                    label="Phone"
                    value="+92 321-7232650"
                    editable={isEditing}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Secondary</h4>
                <div className="space-y-4">
                  <DetailField
                    label="Name"
                    value="Iftikhar Munir"
                    editable={isEditing}
                  />
                  <DetailField
                    label="Relationship"
                    value="Sister"
                    editable={isEditing}
                  />
                  <DetailField
                    label="Phone"
                    value="+92 300-1234567"
                    editable={isEditing}
                  />
                </div>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Bank Information" columns={2}>
            <DetailField
              label="Bank Name"
              value="Bank Al Habib"
              editable={isEditing}
            />
            <DetailField
              label="Bank Account Number"
              value="00000005606241003"
              editable={isEditing}
            />
            <DetailField
              label="IBAN Number"
              value="PK15BAHL00000606241003"
              editable={isEditing}
            />
            <DetailField
              label="Swift Code"
              value="BAHKPKKASC"
              editable={isEditing}
            />
          </DetailSection>

          <DetailSection title="Family Information">
            <DetailDataTable<FamilyMember>
              columns={[
                { label: "Name", key: "name" },
                { label: "Phone", key: "phone" },
                { label: "Relation", key: "relationship" },
                { label: "Age", key: "id", render: () => "-" },
                { label: "Occupation", key: "occupation" },
                { label: "Work Place", key: "workPlace" },
              ]}
              data={familyMembers}
            />
          </DetailSection>

          <DetailSection title="Education">
            <DetailDataTable<EducationRecord>
              columns={[
                { label: "Institution", key: "institution" },
                { label: "Level", key: "level" },
                { label: "Passing Year", key: "passingYear" },
                { label: "Percentage", key: "percentage" },
                { label: "Board", key: "board" },
              ]}
              data={educationRecords}
            />
          </DetailSection>

          <DetailSection title="Employment">
            <DetailDataTable<any>
              columns={[
                {
                  label: "Company",
                  key: "company",
                  render: () => "Royal Softs",
                },
                {
                  label: "Position",
                  key: "position",
                  render: () => "Laravel Developer",
                },
                {
                  label: "From",
                  key: "from",
                  render: () => "2022-11-01",
                },
                { label: "To", key: "to", render: () => "2024-02-01" },
              ]}
              data={[
                { id: 1, company: "Royal Softs" },
                { id: 2, company: "School.pk" },
              ]}
            />
          </DetailSection>
        </div>
      ),
    },
    {
      id: "documents",
      label: "Document",
      content: (
        <DetailDataTable<DocumentRecord>
          title="Student Documents"
          columns={[
            { label: "Document Type", key: "documentType" },
            { label: "Document Number", key: "documentNumber" },
            { label: "Issued Date", key: "issuedDate" },
            { label: "Expiry Date", key: "expiryDate" },
            {
              label: "Status",
              key: "status",
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Valid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status}
                </span>
              ),
            },
          ]}
          data={documentRecords}
        />
      ),
    },
    {
      id: "attendance",
      label: "Attendance",
      content: (
        <DetailDataTable<AttendanceRecord>
          title="Attendance Records"
          columns={[
            { label: "Date", key: "date" },
            {
              label: "Status",
              key: "status",
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Present"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status}
                </span>
              ),
            },
            { label: "Remarks", key: "remarks" },
          ]}
          data={attendanceRecords}
        />
      ),
    },
    {
      id: "assets",
      label: "Asset",
      content: (
        <DetailDataTable<AssetRecord>
          title="Assigned Assets"
          columns={[
            { label: "Asset Type", key: "assetType" },
            { label: "Asset Number", key: "assetNumber" },
            { label: "Issue Date", key: "issueDate" },
            {
              label: "Status",
              key: "status",
              render: (status) => (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {status}
                </span>
              ),
            },
          ]}
          data={assetRecords}
        />
      ),
    },
    {
      id: "history",
      label: "History",
      content: (
        <DetailDataTable<any>
          title="Change History"
          columns={[
            { label: "Changed By", key: "changedBy" },
            { label: "Field", key: "field" },
            { label: "Old Value", key: "oldValue" },
            { label: "New Value", key: "newValue" },
            { label: "Date", key: "date" },
          ]}
          data={[]}
          emptyMessage="No change history available."
        />
      ),
    },
    {
      id: "leave",
      label: "Leave History",
      content: (
        <DetailDataTable<LeaveRecord>
          title="Leave Records"
          columns={[
            { label: "Leave Type", key: "leaveType" },
            { label: "Start Date", key: "startDate" },
            { label: "End Date", key: "endDate" },
            {
              label: "Status",
              key: "status",
              render: (status) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {status}
                </span>
              ),
            },
            { label: "Reason", key: "reason" },
          ]}
          data={leaveRecords}
        />
      ),
    },
    {
      id: "devices",
      label: "Device Details",
      content: (
        <DetailDataTable<DeviceRecord>
          title="Assigned Devices"
          columns={[
            { label: "Device Type", key: "deviceType" },
            { label: "Device Number", key: "deviceNumber" },
            { label: "Assigned Date", key: "assignedDate" },
            {
              label: "Status",
              key: "status",
              render: (status) => (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {status}
                </span>
              ),
            },
          ]}
          data={deviceRecords}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <DetailPageHeader
        title={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
        subtitle="Web Developer"
        status={selectedStudent.status}
        statusColor={
          selectedStudent.status === "active" ? "green" : "red"
        }
        headerInfo={[
          { label: "Phone", value: selectedStudent.phone || "-" },
          { label: "Email", value: selectedStudent.email },
          { label: "Birthday", value: selectedStudent.dateOfBirth || "-" },
          { label: "Address", value: selectedStudent.address || "-" },
          { label: "Gender", value: selectedStudent.gender || "-" },
          {
            label: "CNIC",
            value: "35202-7652693-5",
          },
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
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="danger"
                >
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
