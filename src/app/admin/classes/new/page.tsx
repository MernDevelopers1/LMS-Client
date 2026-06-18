"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { createClass } from "../../../../features/class/classSlice";
import ClassForm from "../../../../components/ClassForm";

export default function NewClassPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.class);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createClass(values));
    if (createClass.fulfilled.match(result)) {
      router.push("/admin/classes");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Add New Class</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new class for an academic year.
        </p>
      </div>
      <ClassForm
        initialValues={{
          name: "",
          description: "",
          academicYearId: 0,
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Class"
        status={status}
        error={error}
      />
    </div>
  );
}
