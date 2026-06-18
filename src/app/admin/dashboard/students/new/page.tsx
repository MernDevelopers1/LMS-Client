"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import { createStudent } from "../../../../../features/student/studentSlice";
import StudentForm from "../../../../../components/StudentForm";

export default function NewStudentPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.student);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createStudent(values));
    if (createStudent.fulfilled.match(result)) {
      router.push("/admin/dashboard/students");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add New Student
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new student account with profile information.
        </p>
      </div>
      <StudentForm
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          registrationNo: "",
          admissionNo: "",
          gender: "",
          dateOfBirth: "",
          admissionDate: "",
          address: "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Student"
        status={status}
        error={error}
        showPassword={true}
        isEdit={false}
      />
    </div>
  );
}
