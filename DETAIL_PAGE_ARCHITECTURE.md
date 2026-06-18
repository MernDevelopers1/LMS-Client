# Student Detail Page - Visual Architecture

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     DetailPageHeader                         │
│  ┌─────────────┐  Muhammad Atique      [Edit] [Delete]      │
│  │ Profile Img │  Web Developer        Status: Active       │
│  └─────────────┘                                             │
│                 Phone │ Email │ Birthday │ Address │ Gender  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [Profile] [Document] [Attendance] [Asset] [History] ...    │
└─────────────────────────────────────────────────────────────┘
│                                                              │
│  DetailSection - Personal Information                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Father's Name │ Mother's Name │ Place of Birth ...  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  DetailSection - Emergency Contact                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │ PRIMARY                     │ SECONDARY             │    │
│  │ Name                        │ Name                  │    │
│  │ Relationship                │ Relationship          │    │
│  │ Phone                       │ Phone                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  DetailSection - Bank Information                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Bank Name │ Account Number │ IBAN │ Swift Code      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  DetailDataTable - Family Information                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Name │ Phone │ Relation │ Age │ Occupation │ ...    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Muhammad Atique │ +92... │ Father │ 45 │ Driver   │   │
│  │ Saima Sultana   │ +92... │ Mother │ 42 │ House... │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  DetailDataTable - Education                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Institution │ Level │ Year │ Percentage │ Board     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ UAF         │ BS    │ 2022 │ 3.5        │ UAF       │   │
│  │ Gov College │ Inter │ 2019 │ 81         │ FBISE     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ... More sections and data tables ...                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
StudentDetailPage
├── DetailPageHeader
│   └── Profile info + Action buttons
│
└── DetailPageTabs
    ├── Tab 1: Profile
    │   ├── DetailSection (Personal Information)
    │   ├── DetailSection (Emergency Contact)
    │   ├── DetailSection (Bank Information)
    │   ├── DetailDataTable (Family Information)
    │   ├── DetailDataTable (Education)
    │   └── DetailDataTable (Employment)
    │
    ├── Tab 2: Document
    │   └── DetailDataTable (Documents)
    │
    ├── Tab 3: Attendance
    │   └── DetailDataTable (Attendance Records)
    │
    ├── Tab 4: Asset
    │   └── DetailDataTable (Assets)
    │
    ├── Tab 5: History
    │   └── DetailDataTable (Change History)
    │
    ├── Tab 6: Leave History
    │   └── DetailDataTable (Leave Records)
    │
    └── Tab 7: Device Details
        └── DetailDataTable (Devices)
```

## File Structure

```
src/components/detail/
├── DetailPageHeader.tsx          # Header component
├── DetailSection.tsx             # Section & Field components
├── DetailPageTabs.tsx            # Tab navigation
├── DetailDataTable.tsx           # Data table
├── index.ts                      # Barrel export
├── README.md                     # Documentation
└── TEMPLATE.tsx                  # Template for other modules

src/app/admin/dashboard/students/
└── [id]/
    └── page.tsx                  # Student detail page implementation
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  StudentDetailPage                          │
│  const { selectedStudent } = useAppSelector(...)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌─────────────────────────────────────────┐
        │  Render DetailPageHeader                 │
        │  - Display student basic info            │
        │  - Show status and action buttons        │
        └─────────────────────────────────────────┘
                            ↓
        ┌─────────────────────────────────────────┐
        │  Render DetailPageTabs                   │
        │  - Multiple tab contents                 │
        └─────────────────────────────────────────┘
                            ↓
        ┌──────────────────────┬──────────────────────┐
        ↓                      ↓                      ↓
    Profile Tab        Documents Tab         Other Tabs
        ↓                      ↓                      ↓
   DetailSections         DetailDataTable      DetailDataTable
        ↓                      ↓                      ↓
   DetailFields           Documents            Other Records
   (Text display)         (Table view)         (Table view)
```

## Styling Features

### Colors & Status

- **Active**: Green badge `bg-green-100 text-green-800`
- **Inactive**: Red badge `bg-red-100 text-red-800`
- **Pending**: Yellow badge `bg-yellow-100 text-yellow-800`
- **Default**: Blue badge `bg-blue-100 text-blue-800`

### Responsive Breakpoints

```
Mobile   (default)
  ↓
sm: 640px  (tablets)
  ↓
md: 768px  (small desktops)
  ↓
lg: 1024px (large desktops)
```

### Border & Shadow

- Border: `border border-slate-200`
- Rounded: `rounded-3xl`
- Shadow: `shadow-sm`
- Background: `bg-white`

## Features Included

✅ **Responsive Design**

- Works on mobile, tablet, desktop
- Flexible column layouts (1-2 columns)
- Overflow handling for tables

✅ **Data Display**

- Text fields
- Tables with sorting/filtering ready
- Status badges with colors
- Custom render functions

✅ **User Interactions**

- Tab switching
- Edit mode toggle
- Action buttons (Edit, Delete, Save, Cancel)
- Hover states

✅ **States**

- Loading skeleton
- Empty state messages
- Error handling
- Edit mode

✅ **Accessibility**

- Semantic HTML
- Proper button types
- Form inputs with labels

## Common Customizations

### Add New Section

```tsx
<DetailSection title="New Section" columns={2}>
  <DetailField label="Field 1" value={data.field1} />
  <DetailField label="Field 2" value={data.field2} />
</DetailSection>
```

### Add New Table

```tsx
<DetailDataTable
  title="New Table"
  columns={[
    { label: "Column 1", key: "col1" },
    {
      label: "Column 2",
      key: "col2",
      render: (value) => <Badge>{value}</Badge>,
    },
  ]}
  data={tableData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Add New Tab

```tsx
{
  id: "newtab",
  label: "New Tab",
  content: <NewTabContent />,
  icon: <IconComponent />,
}
```

## Integration Guide for Other Modules

1. **Copy Template**

   ```
   cp src/components/detail/TEMPLATE.tsx
      src/app/admin/dashboard/[module]/[id]/page.tsx
   ```

2. **Update Imports**
   - Replace `fetchTeacherById` with `fetch[Module]ById`
   - Replace `selectedTeacher` with `selected[Module]`
   - Update Redux slice imports

3. **Customize Content**
   - Update `DetailSection` fields
   - Add/remove tabs as needed
   - Replace mock data with API calls

4. **Style Updates**
   - Adjust status colors if needed
   - Customize header info display
   - Modify column layouts

## Performance Considerations

- Lazy load tab content
- Memoize components for large tables
- Use virtual scrolling for huge datasets
- Optimize images (profile picture)
- Pagination for large tables

## Future Enhancements

- Add print functionality
- Export to PDF
- Bulk actions on tables
- Advanced filtering
- Drag-and-drop reordering
- Inline editing mode
- Version history
- Comments/notes system
