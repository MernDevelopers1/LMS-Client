import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import apiClient from "../utils/apiClient";

type SectionFormValues = {
  name: string;
  classId: number;
  capacity?: number;
};

type SectionFormProps = {
  initialValues: SectionFormValues;
  onSubmit: (values: SectionFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

export default function SectionForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: SectionFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiClient.request("/classes", {
          method: "GET",
        });
        const classData = response.data?.classes ?? response.data ?? [];
        setClasses(Array.isArray(classData) ? classData : []);
      } catch (fetchError) {
        console.error("Failed to fetch classes:", fetchError);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (field: keyof SectionFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.name.trim()) errors.name = "Section name is required.";
    if (!values.classId) errors.classId = "Class is required.";
    if (values.capacity !== undefined && values.capacity !== null) {
      if (isNaN(values.capacity) || values.capacity <= 0) {
        errors.capacity = "Capacity must be a positive number.";
      }
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
        label="Section Name"
        id="name"
        name="name"
        value={values.name}
        placeholder="Section A"
        onChange={(value) => handleChange("name", value)}
        error={fieldErrors.name}
      />

      <div>
        <label htmlFor="classId" className="block text-sm font-medium text-slate-700">
          Class
        </label>
        <select
          id="classId"
          value={values.classId || ""}
          onChange={(e) => handleChange("classId", Number(e.target.value))}
          disabled={loadingClasses}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">
            {loadingClasses ? "Loading..." : "Select Class"}
          </option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        {fieldErrors.classId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.classId}</p>
        )}
      </div>

      <FormInput
        label="Capacity (Optional)"
        id="capacity"
        name="capacity"
        type="number"
        value={values.capacity !== undefined ? String(values.capacity) : ""}
        placeholder="40"
        onChange={(value) => handleChange("capacity", value ? Number(value) : undefined)}
        error={fieldErrors.capacity}
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
