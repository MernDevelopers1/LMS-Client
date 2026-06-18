"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchClassById,
  updateClass,
  clearSelectedClass,
} from "../../../../../features/class/classSlice";
import ClassForm from "../../../../../components/ClassForm";

export default function EditClassPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const classId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedClass, status, error } = useAppSelector(
    (state) => state.class,
  );

  useEffect(() => {
    if (classId > 0) {
      dispatch(fetchClassById(classId));
    }
    return () => {
      dispatch(clearSelectedClass());
    };
  }, [dispatch, classId]);

  const handleSubmit = async (values: any) => {
    if (!classId) return;
    const result = await dispatch(updateClass({ id: classId, ...values }));
    if (updateClass.fulfilled.match(result)) {
      router.push("/admin/dashboard/classes");
    }
  };

  if (status === "loading" && !selectedClass) {
    return <div className="p-8 text-slate-600">Loading class details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Class</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update class details and information.
        </p>
      </div>
      {selectedClass ? (
        <ClassForm
          initialValues={{
            name: selectedClass.name,
            description: selectedClass.description || "",
            academicYearId: selectedClass.academicYearId || 0,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Class not found.
        </div>
      )}
    </div>
  );
}
