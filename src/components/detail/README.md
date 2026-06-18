# Detail Page System - Reusable Components

## Overview

The detail page system provides modular, reusable components for creating comprehensive entity detail pages across the LMS application. The design follows the pattern shown in the student detail page, with organized sections, tabbed content, and data tables.

## Components

### 1. **DetailPageHeader**

The main header component that displays entity information with profile image, status badge, and action buttons.

**Features:**

- Profile image display
- Status badges with color options
- Quick info grid (phone, email, dates, etc.)
- Action buttons (Edit, Delete, Save, Cancel)

**Usage:**

```tsx
import { DetailPageHeader } from "@/components/detail";

<DetailPageHeader
  title="Muhammad Atique"
  subtitle="Web Developer"
  profileImage="/path/to/image.jpg"
  status="active"
  statusColor="green"
  headerInfo={[
    { label: "Phone", value: "+92 321-7232650" },
    { label: "Email", value: "user@example.com" },
    { label: "Birthday", value: "1993-03-15" },
    { label: "Address", value: "Karachi, Pakistan" },
  ]}
  actionButton={<Button onClick={handleEdit}>Edit</Button>}
/>;
```

**Props:**

- `title` (string, required): Main heading
- `subtitle` (string): Secondary heading or role
- `profileImage` (string): URL to profile image
- `status` (string): Status text
- `statusColor` ("green" | "red" | "yellow" | "blue"): Badge color
- `headerInfo` (Array): Quick info items
- `actionButton` (ReactNode): Button group for actions

---

### 2. **DetailSection & DetailField**

Components for organizing and displaying detail information in sections.

**Usage:**

```tsx
import { DetailSection, DetailField } from "@/components/detail";

<DetailSection title="Personal Information" columns={2}>
  <DetailField
    label="Father's Name"
    value="Munir Ahmad"
    editable={isEditing}
    onChange={(value) => updateField("fathersName", value)}
  />
  <DetailField
    label="Date of Birth"
    value="1993-03-15"
    type="date"
    editable={isEditing}
  />
</DetailSection>;
```

**DetailSection Props:**

- `title` (string): Section heading
- `description` (string): Optional subtitle
- `columns` (1 | 2): Grid columns
- `children` (ReactNode): Content

**DetailField Props:**

- `label` (string): Field label
- `value` (string | number): Field value
- `type` ("text" | "email" | "tel" | "date" | "number"): Input type
- `editable` (boolean): Enable edit mode
- `onChange` (function): Value change callback
- `placeholder` (string): Placeholder text

---

### 3. **DetailPageTabs**

Tab navigation component for organizing related data.

**Usage:**

```tsx
import { DetailPageTabs } from "@/components/detail";

const tabs: DetailPageTab[] = [
  {
    id: "profile",
    label: "Profile",
    content: <ProfileContent />,
  },
  {
    id: "documents",
    label: "Documents",
    content: <DocumentsContent />,
    disabled: false,
  },
];

<DetailPageTabs
  tabs={tabs}
  defaultTabId="profile"
  onChange={(tabId) => console.log(tabId)}
/>;
```

**DetailPageTab Props:**

- `id` (string): Unique tab identifier
- `label` (string): Tab label
- `content` (ReactNode): Tab content
- `icon` (ReactNode): Optional icon
- `disabled` (boolean): Disable tab

---

### 4. **DetailDataTable**

Reusable table component for displaying related data in tabular format.

**Usage:**

```tsx
import { DetailDataTable } from "@/components/detail";

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  phone: string;
}

<DetailDataTable<FamilyMember>
  title="Family Information"
  columns={[
    { label: "Name", key: "name" },
    { label: "Relationship", key: "relationship" },
    { label: "Phone", key: "phone" },
  ]}
  data={familyMembers}
  isLoading={false}
  onEdit={(item) => handleEdit(item)}
  onDelete={(item) => handleDelete(item)}
/>;
```

**Props:**

- `title` (string): Table heading
- `columns` (Array): Column definitions
- `data` (Array): Table data
- `isLoading` (boolean): Loading state
- `emptyMessage` (string): Empty state message
- `onEdit` (function): Edit handler
- `onDelete` (function): Delete handler
- `actions` (boolean): Show action buttons

**Column Definition:**

```tsx
interface DetailDataTableColumn<T> {
  label: string; // Column header
  key: keyof T; // Data key
  render?: (value, item) => ReactNode; // Custom render
  className?: string; // Custom CSS
}
```

---

## Complete Implementation Example: Teacher Detail Page

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../../../../../features/teacher/teacherSlice";
import Button from "../../../../../components/Button";
import {
  DetailPageHeader,
  DetailSection,
  DetailField,
  DetailPageTabs,
  DetailDataTable,
  type DetailPageTab,
} from "../../../../../components/detail";

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = Number(params.id);
  const dispatch = useAppDispatch();
  const { selectedTeacher, status } = useAppSelector((state) => state.teacher);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchTeacherById(teacherId));
    }
  }, [dispatch, teacherId]);

  // Mock related data
  const classesAssigned = [
    { id: 1, className: "Class 10-A", subject: "Mathematics" },
    { id: 2, className: "Class 10-B", subject: "Mathematics" },
    { id: 3, className: "Class 11-A", subject: "Mathematics" },
  ];

  const qualifications = [
    {
      id: 1,
      degree: "BS",
      subject: "Mathematics",
      university: "University of Karachi",
    },
    { id: 2, degree: "MS", subject: "Mathematics", university: "FAST NUCES" },
  ];

  const tabs: DetailPageTab[] = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="space-y-6">
          <DetailSection title="Personal Information" columns={2}>
            <DetailField
              label="First Name"
              value={selectedTeacher?.firstName}
            />
            <DetailField label="Last Name" value={selectedTeacher?.lastName} />
            <DetailField label="Email" value={selectedTeacher?.email} />
            <DetailField label="Phone" value={selectedTeacher?.phone} />
            <DetailField label="Gender" value={selectedTeacher?.gender} />
            <DetailField
              label="Date of Birth"
              value={selectedTeacher?.dateOfBirth}
            />
          </DetailSection>

          <DetailSection title="Classes Assigned">
            <DetailDataTable
              columns={[
                { label: "Class", key: "className" },
                { label: "Subject", key: "subject" },
              ]}
              data={classesAssigned}
            />
          </DetailSection>

          <DetailSection title="Qualifications">
            <DetailDataTable
              columns={[
                { label: "Degree", key: "degree" },
                { label: "Subject", key: "subject" },
                { label: "University", key: "university" },
              ]}
              data={qualifications}
            />
          </DetailSection>
        </div>
      ),
    },
  ];

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!selectedTeacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
        status={selectedTeacher.status}
        statusColor="green"
        headerInfo={[
          { label: "Email", value: selectedTeacher.email },
          { label: "Phone", value: selectedTeacher.phone },
          { label: "Subject", value: "Mathematics" },
        ]}
        actionButton={
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button
              variant="danger"
              onClick={() => dispatch(deleteTeacher(teacherId))}
            >
              Delete
            </Button>
          </div>
        }
      />

      <DetailPageTabs tabs={tabs} />
    </div>
  );
}
```

---

## Styling Notes

- **Rounded corners**: All components use `rounded-3xl` for consistency
- **Border styling**: `border border-slate-200` with `shadow-sm`
- **Colors**: Uses Tailwind slate, green, red, yellow, blue palettes
- **Responsive**: Fully responsive with `sm:`, `md:`, `lg:` breakpoints
- **Status badges**: Color-coded (green=active, red=inactive, yellow=pending, blue=default)

---

## Integration Steps for New Modules

1. Create `/components/detail` if not exists
2. Import detail components
3. Fetch entity data using Redux slice
4. Define related data interfaces
5. Organize content in tabs using `DetailPageTabs`
6. Use `DetailSection` for grouped fields
7. Use `DetailDataTable` for bulk data
8. Implement edit/delete handlers

---

## Notes

- All components are fully modular and reusable
- Mock data included in examples (replace with real API calls)
- Edit mode needs implementation based on your state management
- Customize colors and layouts by modifying Tailwind classes
