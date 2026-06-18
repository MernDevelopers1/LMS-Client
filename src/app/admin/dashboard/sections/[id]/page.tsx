"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchSectionById,
  updateSection,
  clearSelectedSection,
} from "../../../../../features/section/sectionSlice";
import SectionForm from "../../../../../components/SectionForm";

export default function EditSectionPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const sectionId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedSection, status, error } = useAppSelector(
    (state) => state.section,
  );

  useEffect(() => {
    if (sectionId > 0) {
      dispatch(fetchSectionById(sectionId));
    }
    return () => {
      dispatch(clearSelectedSection());
    };
  }, [dispatch, sectionId]);

  const handleSubmit = async (values: any) => {
    if (!sectionId) return;
    const result = await dispatch(updateSection({ id: sectionId, ...values }));
    if (updateSection.fulfilled.match(result)) {
      router.push("/admin/dashboard/sections");
    }
  };

  if (status === "loading" && !selectedSection) {
    return <div className="p-8 text-slate-600">Loading section details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Section</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update section details and information.
        </p>
      </div>
      {selectedSection ? (
        <SectionForm
          initialValues={{
            name: selectedSection.name,
            classId: selectedSection.classId,
            capacity: selectedSection.capacity,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Section not found.
        </div>
      )}
    </div>
  );
}
