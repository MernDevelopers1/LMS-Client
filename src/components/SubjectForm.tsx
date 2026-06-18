import { useState } from "react";
import FormInput from "./FormInput";

type SubjectFormValues = {
  code: string;
  name: string;
  description?: string;
  totalMarks?: number;
  passingMarks?: number;
};

type SubjectFormProps = {
  initialValues: SubjectFormValues;
  onSubmit: (values: SubjectFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

export default function SubjectForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: SubjectFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SubjectFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.code.trim()) errors.code = "Subject code is required.";
    if (!values.name.trim()) errors.name = "Subject name is required.";

    const totalMarks = values.totalMarks ?? 100;
    const passingMarks = values.passingMarks ?? 0;

    if (isNaN(totalMarks) || totalMarks <= 0) {
      errors.totalMarks = "Total marks must be a positive number.";
    }
    if (isNaN(passingMarks) || passingMarks < 0) {
      errors.passingMarks = "Passing marks cannot be negative.";
    }
    if (passingMarks > totalMarks) {
      errors.passingMarks = "Passing marks cannot exceed total marks.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <FormInput
        label="Subject Code"
        id="code"
        name="code"
        value={values.code}
        placeholder="MATH001"
        onChange={(value) => handleChange("code", value)}
        error={fieldErrors.code}
      />

      <FormInput
        label="Subject Name"
        id="name"
        name="name"
        value={values.name}
        placeholder="Mathematics"
        onChange={(value) => handleChange("name", value)}
        error={fieldErrors.name}
      />

      <FormInput
        label="Total Marks"
        id="totalMarks"
        name="totalMarks"
        type="number"
        value={values.totalMarks !== undefined ? String(values.totalMarks) : "100"}
        placeholder="100"
        onChange={(value) => handleChange("totalMarks", value ? Number(value) : 100)}
        error={fieldErrors.totalMarks}
      />

      <FormInput
        label="Passing Marks"
        id="passingMarks"
        name="passingMarks"
        type="number"
        value={values.passingMarks !== undefined ? String(values.passingMarks) : "0"}
        placeholder="0"
        onChange={(value) => handleChange("passingMarks", value ? Number(value) : 0)}
        error={fieldErrors.passingMarks}
      />

      <div className="md:col-span-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Subject description or notes..."
          rows={4}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

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
