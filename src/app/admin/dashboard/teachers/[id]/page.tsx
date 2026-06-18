"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import {
  fetchTeacherById,
  updateTeacher,
  clearSelectedTeacher,
} from "../../../../../features/teacher/teacherSlice";
import TeacherForm from "../../../../../components/TeacherForm";

export default function EditTeacherPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const teacherId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedTeacher, status, error } = useAppSelector(
    (state) => state.teacher,
  );

  useEffect(() => {
    if (teacherId > 0) {
      dispatch(fetchTeacherById(teacherId));
    }
    return () => {
      dispatch(clearSelectedTeacher());
    };
  }, [dispatch, teacherId]);

  const handleSubmit = async (values: any) => {
    if (!teacherId) return;
    const result = await dispatch(updateTeacher({ id: teacherId, ...values }));
    if (updateTeacher.fulfilled.match(result)) {
      router.push("/admin/dashboard/teachers");
    }
  };

  if (status === "loading" && !selectedTeacher) {
    return <div className="p-8 text-slate-600">Loading teacher details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Teacher</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update teacher profile or account details.
        </p>
      </div>
      {selectedTeacher ? (
        <TeacherForm
          initialValues={{
            firstName: selectedTeacher.firstName,
            lastName: selectedTeacher.lastName,
            email: selectedTeacher.email,
            password: "",
            phone: selectedTeacher.phone || "",
            employeeNo: selectedTeacher.employeeNo || "",
            designation: selectedTeacher.designation || "",
            qualification: selectedTeacher.qualification || "",
            joiningDate: selectedTeacher.joiningDate || "",
            address: selectedTeacher.address || "",
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
          showPassword={true}
          isEdit={true}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Teacher not found.
        </div>
      )}
    </div>
  );
}
