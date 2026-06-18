import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import apiClient from "../utils/apiClient";

type ClassFormValues = {
  name: string;
  description: string;
  academicYearId: number;
};

type ClassFormProps = {
  initialValues: ClassFormValues;
  onSubmit: (values: ClassFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

export default function ClassForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: ClassFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [academicYears, setAcademicYears] = useState<
    Array<{ id: number; title: string }>
  >([]);
  const [loadingYears, setLoadingYears] = useState(true);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await apiClient.request("/academics/years", {
          method: "GET",
        });
        setAcademicYears(response.data || []);
      } catch (error) {
        console.error("Failed to fetch academic years:", error);
      } finally {
        setLoadingYears(false);
      }
    };

    fetchAcademicYears();
  }, []);

  const handleChange = (field: keyof ClassFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.name.trim()) errors.name = "Class name is required.";
    if (!values.academicYearId)
      errors.academicYearId = "Academic year is required.";
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
        label="Class Name"
        id="name"
        name="name"
        value={values.name}
        placeholder="Class 10-A"
        onChange={(value) => handleChange("name", value)}
        error={fieldErrors.name}
      />

      <div>
        <label
          htmlFor="academicYearId"
          className="block text-sm font-medium text-slate-700"
        >
          Academic Year
        </label>
        <select
          id="academicYearId"
          name="academicYearId"
          value={values.academicYearId}
          onChange={(e) =>
            handleChange("academicYearId", Number(e.target.value))
          }
          disabled={loadingYears}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">
            {loadingYears ? "Loading..." : "Select Academic Year"}
          </option>
          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.title}
            </option>
          ))}
        </select>
        {fieldErrors.academicYearId && (
          <p className="mt-1 text-sm text-rose-600">
            {fieldErrors.academicYearId}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add class details or notes..."
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
