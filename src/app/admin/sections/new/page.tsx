"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { createSection } from "../../../../features/section/sectionSlice";
import SectionForm from "../../../../components/SectionForm";

export default function NewSectionPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.section);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createSection(values));
    if (createSection.fulfilled.match(result)) {
      router.push("/admin/sections");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Add New Section</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new section for a class.
        </p>
      </div>
      <SectionForm
        initialValues={{
          name: "",
          classId: 0,
          capacity: undefined,
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Section"
        status={status}
        error={error}
      />
    </div>
  );
}
