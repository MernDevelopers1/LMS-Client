import { useState } from "react";
import FormInput from "./FormInput";

type TeacherFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  employeeNo: string;
  designation: string;
  qualification: string;
  joiningDate: string;
  address: string;
};

type TeacherFormProps = {
  initialValues: TeacherFormValues;
  onSubmit: (values: TeacherFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  showPassword?: boolean;
  isEdit?: boolean;
};

export default function TeacherForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
  showPassword = false,
  isEdit = false,
}: TeacherFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof TeacherFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.firstName.trim()) errors.firstName = "First name is required.";
    if (!values.lastName.trim()) errors.lastName = "Last name is required.";
    if (!values.email.trim()) errors.email = "Email is required.";
    if (showPassword && !isEdit && !values.password?.trim())
      errors.password = "Password is required.";
    if (!values.employeeNo.trim())
      errors.employeeNo = "Employee number is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    
    // During edit, exclude empty password from submission so it doesn't overwrite existing password
    const submitValues = isEdit && !values.password
      ? { ...values, password: undefined }
      : values;
    
    await onSubmit(submitValues);
  };
  console.log("values :>> ", values);
  console.log("initialValues :>> ", initialValues);
  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <FormInput
        label="First Name"
        id="firstName"
        name="firstName"
        value={values.firstName}
        placeholder="John"
        onChange={(value) => handleChange("firstName", value)}
        error={fieldErrors.firstName}
      />
      <FormInput
        label="Last Name"
        id="lastName"
        name="lastName"
        value={values.lastName}
        placeholder="Doe"
        onChange={(value) => handleChange("lastName", value)}
        error={fieldErrors.lastName}
      />
      <FormInput
        label="Email"
        id="email"
        name="email"
        type="email"
        value={values.email}
        placeholder="john.doe@example.com"
        autoComplete="email"
        onChange={(value) => handleChange("email", value)}
        error={fieldErrors.email}
      />
      {showPassword ? (
        <FormInput
          label={`Password${isEdit ? " (optional - leave blank to keep current password)" : ""}`}
          id="password"
          name="password"
          type="password"
          value={values.password ?? ""}
          placeholder="••••••••"
          autoComplete="new-password"
          onChange={(value) => handleChange("password", value)}
          error={fieldErrors.password}
        />
      ) : null}
      <FormInput
        label="Phone"
        id="phone"
        name="phone"
        type="tel"
        value={values.phone}
        placeholder="123-456-7890"
        autoComplete="tel"
        onChange={(value) => handleChange("phone", value)}
        error={fieldErrors.phone}
      />
      <FormInput
        label="Employee Number"
        id="employeeNo"
        name="employeeNo"
        value={values.employeeNo}
        placeholder="EMP-001"
        onChange={(value) => handleChange("employeeNo", value)}
        error={fieldErrors.employeeNo}
      />
      <FormInput
        label="Designation"
        id="designation"
        name="designation"
        value={values.designation}
        placeholder="Math Teacher"
        onChange={(value) => handleChange("designation", value)}
        error={fieldErrors.designation}
      />
      <FormInput
        label="Qualification"
        id="qualification"
        name="qualification"
        value={values.qualification}
        placeholder="M.Ed"
        onChange={(value) => handleChange("qualification", value)}
        error={fieldErrors.qualification}
      />

      <FormInput
        label="Joining Date"
        id="joiningDate"
        name="joiningDate"
        type="date"
        value={new Date(values.joiningDate).toISOString().split("T")[0]} // Format date to YYYY-MM-DD
        onChange={(value) => handleChange("joiningDate", value)}
        error={fieldErrors.joiningDate}
      />
      <FormInput
        label="Address"
        id="address"
        name="address"
        value={values.address}
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
          {status === "loading" ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
