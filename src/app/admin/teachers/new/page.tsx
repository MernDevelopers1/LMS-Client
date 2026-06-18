"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { createTeacher } from "../../../../features/teacher/teacherSlice";
import FormInput from "../../../../components/FormInput";

export default function NewTeacherPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.teacher);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    employeeNo: "",
    designation: "",
    qualification: "",
    joiningDate: "",
    address: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formState.firstName.trim())
      errors.firstName = "First name is required.";
    if (!formState.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formState.email.trim()) errors.email = "Email is required.";
    if (!formState.password.trim()) errors.password = "Password is required.";
    if (!formState.employeeNo.trim())
      errors.employeeNo = "Employee number is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const result = await dispatch(
      createTeacher({
        ...formState,
      }),
    );

    if (createTeacher.fulfilled.match(result)) {
      router.push("/admin/teachers");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Add New Teacher
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Use this form to add a new teacher account and profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <FormInput
          label="First Name"
          id="firstName"
          name="firstName"
          value={formState.firstName}
          placeholder="John"
          onChange={(value) => handleChange("firstName", value)}
          error={fieldErrors.firstName}
        />
        <FormInput
          label="Last Name"
          id="lastName"
          name="lastName"
          value={formState.lastName}
          placeholder="Doe"
          onChange={(value) => handleChange("lastName", value)}
          error={fieldErrors.lastName}
        />
        <FormInput
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formState.email}
          placeholder="john.doe@example.com"
          autoComplete="email"
          onChange={(value) => handleChange("email", value)}
          error={fieldErrors.email}
        />
        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formState.password}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={(value) => handleChange("password", value)}
          error={fieldErrors.password}
        />
        <FormInput
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          value={formState.phone}
          placeholder="123-456-7890"
          autoComplete="tel"
          onChange={(value) => handleChange("phone", value)}
          error={fieldErrors.phone}
        />
        <FormInput
          label="Employee Number"
          id="employeeNo"
          name="employeeNo"
          value={formState.employeeNo}
          placeholder="EMP-001"
          onChange={(value) => handleChange("employeeNo", value)}
          error={fieldErrors.employeeNo}
        />
        <FormInput
          label="Designation"
          id="designation"
          name="designation"
          value={formState.designation}
          placeholder="Math Teacher"
          onChange={(value) => handleChange("designation", value)}
          error={fieldErrors.designation}
        />
        <FormInput
          label="Qualification"
          id="qualification"
          name="qualification"
          value={formState.qualification}
          placeholder="M.Ed"
          onChange={(value) => handleChange("qualification", value)}
          error={fieldErrors.qualification}
        />
        <FormInput
          label="Joining Date"
          id="joiningDate"
          name="joiningDate"
          type="date"
          value={formState.joiningDate}
          onChange={(value) => handleChange("joiningDate", value)}
          error={fieldErrors.joiningDate}
        />
        <FormInput
          label="Address"
          id="address"
          name="address"
          value={formState.address}
          placeholder="1234 School Road"
          onChange={(value) => handleChange("address", value)}
          error={fieldErrors.address}
        />

        <div className="md:col-span-2">
          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-4 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "loading" ? "Saving..." : "Save Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
}
