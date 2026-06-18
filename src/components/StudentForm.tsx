import { useState } from "react";
import FormInput from "./FormInput";

type StudentFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  registrationNo: string;
  admissionNo: string;
  gender: string;
  dateOfBirth: string;
  admissionDate: string;
  address: string;
};

type StudentFormProps = {
  initialValues: StudentFormValues;
  onSubmit: (values: StudentFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  showPassword?: boolean;
  isEdit?: boolean;
};

export default function StudentForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
  showPassword = false,
  isEdit = false,
}: StudentFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof StudentFormValues, value: string) => {
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
    if (!values.registrationNo.trim())
      errors.registrationNo = "Registration number is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    // During edit, exclude empty password from submission so it doesn't overwrite existing password
    const submitValues =
      isEdit && !values.password ? { ...values, password: undefined } : values;

    await onSubmit(submitValues);
  };

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
        label="Registration Number"
        id="registrationNo"
        name="registrationNo"
        value={values.registrationNo}
        placeholder="REG-001"
        onChange={(value) => handleChange("registrationNo", value)}
        error={fieldErrors.registrationNo}
      />
      <FormInput
        label="Admission Number"
        id="admissionNo"
        name="admissionNo"
        value={values.admissionNo}
        placeholder="ADM-001"
        onChange={(value) => handleChange("admissionNo", value)}
        error={fieldErrors.admissionNo}
      />
      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-slate-700"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={values.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <FormInput
        label="Date of Birth"
        id="dateOfBirth"
        name="dateOfBirth"
        type="date"
        value={
          values.dateOfBirth
            ? new Date(values.dateOfBirth).toISOString().split("T")[0]
            : ""
        }
        onChange={(value) => handleChange("dateOfBirth", value)}
        error={fieldErrors.dateOfBirth}
      />

      <FormInput
        label="Admission Date"
        id="admissionDate"
        name="admissionDate"
        type="date"
        value={
          values.admissionDate
            ? new Date(values.admissionDate).toISOString().split("T")[0]
            : ""
        }
        onChange={(value) => handleChange("admissionDate", value)}
        error={fieldErrors.admissionDate}
      />

      <FormInput
        label="Address"
        id="address"
        name="address"
        value={values.address}
        placeholder="1234 Main Street"
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
