"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  fetchSubjectById,
  updateSubject,
  clearSelectedSubject,
} from "../../../../../../features/subject/subjectSlice";
import SubjectForm from "../../../../../../components/SubjectForm";

export default function EditSubjectPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const subjectId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedSubject, status, error } = useAppSelector(
    (state) => state.subject,
  );

  useEffect(() => {
    if (subjectId > 0) {
      dispatch(fetchSubjectById(subjectId));
    }
    return () => {
      dispatch(clearSelectedSubject());
    };
  }, [dispatch, subjectId]);

  const handleSubmit = async (values: any) => {
    if (!subjectId) return;
    const result = await dispatch(updateSubject({ id: subjectId, ...values }));
    if (updateSubject.fulfilled.match(result)) {
      router.push("/admin/dashboard/subjects");
    }
  };

  if (status === "loading" && !selectedSubject) {
    return <div className="p-8 text-slate-600">Loading subject details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Subject</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update subject information and marks configuration.
        </p>
      </div>
      {selectedSubject ? (
        <SubjectForm
          initialValues={{
            code: selectedSubject.code,
            name: selectedSubject.name,
            description: selectedSubject.description,
            totalMarks: selectedSubject.totalMarks,
            passingMarks: selectedSubject.passingMarks,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Subject not found.
        </div>
      )}
    </div>
  );
}
