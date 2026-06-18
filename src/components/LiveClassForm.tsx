import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import apiClient from "../utils/apiClient";

type LiveClassFormValues = {
  sectionId: number;
  subjectId: number;
  teacherId: number;
  title: string;
  description?: string;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  startTime: string;
  durationMinutes: number;
  recordingUrl?: string;
  status: string;
};

type LiveClassFormProps = {
  initialValues: LiveClassFormValues;
  onSubmit: (values: LiveClassFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Helper: Convert database datetime format (YYYY-MM-DD HH:mm:ss) to datetime-local format (YYYY-MM-DDTHH:mm)
function formatDatetimeForInput(datetimeStr: string): string {
  if (!datetimeStr) return "";
  try {
    // Handle format: "2026-06-17 14:30:00" -> "2026-06-17T14:30"
    const normalized = datetimeStr.replace(" ", "T").slice(0, 16);
    return normalized;
  } catch {
    return "";
  }
}

export default function LiveClassForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: LiveClassFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [sections, setSections] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [teachers, setTeachers] = useState<
    Array<{
      id: number;
      profileId: number;
      firstName: string;
      lastName: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [sectionsRes, subjectsRes, teachersRes] = await Promise.all([
          apiClient.request("/academics/sections", { method: "GET" }),
          apiClient.request("/academics/subjects", { method: "GET" }),
          apiClient.request("/teachers", { method: "GET" }),
        ]);

        const sectionsData =
          sectionsRes.data?.sections ?? sectionsRes.data ?? [];
        const subjectsData =
          subjectsRes.data?.subjects ?? subjectsRes.data ?? [];
        const teachersData =
          teachersRes.data?.teachers ?? teachersRes.data ?? [];

        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setTeachers(Array.isArray(teachersData) ? teachersData : []);
      } catch (fetchError) {
        console.error("Failed to load dropdown data:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (field: keyof LiveClassFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  // Debug: Log teacher data when loaded
  useEffect(() => {
    if (teachers.length > 0) {
      console.log("Loaded teachers:", teachers);
    }
  }, [teachers]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.sectionId) errors.sectionId = "Section is required.";
    if (!values.subjectId) errors.subjectId = "Subject is required.";
    if (!values.teacherId) errors.teacherId = "Teacher is required.";
    if (!values.title.trim()) errors.title = "Title is required.";
    if (!values.startTime.trim()) errors.startTime = "Start time is required.";
    if (!values.durationMinutes || values.durationMinutes <= 0) {
      errors.durationMinutes = "Duration must be greater than 0.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...values,
      durationMinutes: Number(values.durationMinutes),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <div>
        <label
          htmlFor="sectionId"
          className="block text-sm font-medium text-slate-700"
        >
          Section
        </label>
        <select
          id="sectionId"
          value={values.sectionId || ""}
          onChange={(e) => handleChange("sectionId", Number(e.target.value))}
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Section"}</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
        {fieldErrors.sectionId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.sectionId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="subjectId"
          className="block text-sm font-medium text-slate-700"
        >
          Subject
        </label>
        <select
          id="subjectId"
          value={values.subjectId || ""}
          onChange={(e) => handleChange("subjectId", Number(e.target.value))}
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Subject"}</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {fieldErrors.subjectId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.subjectId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="teacherId"
          className="block text-sm font-medium text-slate-700"
        >
          Teacher
        </label>
        <select
          id="teacherId"
          value={values.teacherId || ""}
          onChange={(e) => handleChange("teacherId", Number(e.target.value))}
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Teacher"}</option>
          {teachers.map((teacher) => (
            <option key={teacher.profileId} value={teacher.profileId}>
              {teacher.firstName} {teacher.lastName}
            </option>
          ))}
        </select>
        {fieldErrors.teacherId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.teacherId}</p>
        )}
      </div>

      <FormInput
        label="Title"
        id="title"
        name="title"
        value={values.title}
        placeholder="Zoom Algebra Session"
        onChange={(value) => handleChange("title", value)}
        error={fieldErrors.title}
      />

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-slate-700"
        >
          Status
        </label>
        <select
          id="status"
          value={values.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="startTime"
          className="block text-sm font-medium text-slate-700"
        >
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={formatDatetimeForInput(values.startTime)}
          onChange={(e) => handleChange("startTime", e.target.value || "")}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {fieldErrors.startTime && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.startTime}</p>
        )}
      </div>

      <FormInput
        label="Duration (minutes)"
        id="durationMinutes"
        name="durationMinutes"
        type="number"
        value={String(values.durationMinutes || "")}
        placeholder="45"
        onChange={(value) => handleChange("durationMinutes", Number(value))}
        error={fieldErrors.durationMinutes}
      />

      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={values.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Optional session details"
          rows={4}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <FormInput
        label="Zoom Meeting ID"
        id="zoomMeetingId"
        name="zoomMeetingId"
        value={values.zoomMeetingId || ""}
        placeholder="9876543210"
        onChange={(value) => handleChange("zoomMeetingId", value)}
      />

      <FormInput
        label="Zoom Join URL"
        id="zoomJoinUrl"
        name="zoomJoinUrl"
        value={values.zoomJoinUrl || ""}
        placeholder="https://zoom.us/j/9876543210"
        onChange={(value) => handleChange("zoomJoinUrl", value)}
      />

      <FormInput
        label="Zoom Start URL"
        id="zoomStartUrl"
        name="zoomStartUrl"
        value={values.zoomStartUrl || ""}
        placeholder="https://zoom.us/s/9876543210"
        onChange={(value) => handleChange("zoomStartUrl", value)}
      />

      <FormInput
        label="Recording URL"
        id="recordingUrl"
        name="recordingUrl"
        value={values.recordingUrl || ""}
        placeholder="https://example.com/recording"
        onChange={(value) => handleChange("recordingUrl", value)}
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
