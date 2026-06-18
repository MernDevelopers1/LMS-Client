"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import { createSubject } from "../../../../../features/subject/subjectSlice";
import SubjectForm from "../../../../../components/SubjectForm";

export default function NewSubjectPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.subject);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createSubject(values));
    if (createSubject.fulfilled.match(result)) {
      router.push("/admin/dashboard/subjects");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add New Subject
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new academic subject with marks configuration.
        </p>
      </div>
      <SubjectForm
        initialValues={{
          code: "",
          name: "",
          description: "",
          totalMarks: 100,
          passingMarks: 0,
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Subject"
        status={status}
        error={error}
      />
    </div>
  );
}
