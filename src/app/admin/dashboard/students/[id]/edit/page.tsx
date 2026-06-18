"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  fetchStudentById,
  updateStudent,
  clearSelectedStudent,
} from "../../../../../../features/student/studentSlice";
import StudentForm from "../../../../../../components/StudentForm";

export default function EditStudentPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const studentId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedStudent, status, error } = useAppSelector(
    (state) => state.student,
  );

  useEffect(() => {
    if (studentId > 0) {
      dispatch(fetchStudentById(studentId));
    }
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch, studentId]);

  const handleSubmit = async (values: any) => {
    if (!studentId) return;
    const result = await dispatch(updateStudent({ id: studentId, ...values }));
    if (updateStudent.fulfilled.match(result)) {
      router.push("/admin/dashboard/students");
    }
  };

  if (status === "loading" && !selectedStudent) {
    return <div className="p-8 text-slate-600">Loading student details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Student</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update student profile or account details.
        </p>
      </div>
      {selectedStudent ? (
        <StudentForm
          initialValues={{
            firstName: selectedStudent.firstName,
            lastName: selectedStudent.lastName,
            email: selectedStudent.email,
            password: "",
            phone: selectedStudent.phone || "",
            registrationNo: selectedStudent.registrationNo || "",
            admissionNo: selectedStudent.admissionNo || "",
            gender: selectedStudent.gender || "",
            dateOfBirth: selectedStudent.dateOfBirth || "",
            admissionDate: selectedStudent.admissionDate || "",
            address: selectedStudent.address || "",
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
          Student not found.
        </div>
      )}
    </div>
  );
}
