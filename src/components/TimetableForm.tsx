import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

type TimetableFormValues = {
  sectionId?: number;
  subjectId: number;
  teacherId: number;
  roomId?: number;
  lectureSlotId: number;
  dayOfWeek: number;
};

type TimetableFormProps = {
  initialValues: TimetableFormValues;
  onSubmit: (values: TimetableFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};
const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export default function TimetableForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: TimetableFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [sections, setSections] = useState<
    Array<{ id: number; name: string; className?: string }>
  >([]);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [teachers, setTeachers] = useState<
    Array<{
      id: number;
      profileId?: number;
      firstName: string;
      lastName: string;
    }>
  >([]);
  const [rooms, setRooms] = useState<Array<{ id: number; roomName: string }>>(
    [],
  );
  const [lectureSlots, setLectureSlots] = useState<
    Array<{ id: number; title: string }>
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [sectionsRes, subjectsRes, teachersRes, roomsRes, slotsRes] =
          await Promise.all([
            apiClient.request("/sections", { method: "GET" }),
            apiClient.request("/subjects", { method: "GET" }),
            apiClient.request("/teachers", { method: "GET" }),
            apiClient.request("/rooms", { method: "GET" }),
            apiClient.request("/lecture-slots", { method: "GET" }),
          ]);
        const sectionData =
          sectionsRes.data?.sections ?? sectionsRes.data ?? [];
        setSections(Array.isArray(sectionData) ? sectionData : []);
        setSubjects(subjectsRes?.data?.subjects || []);
        setTeachers(teachersRes.data.teachers || []);
        setRooms(roomsRes.data.rooms || []);
        setLectureSlots(slotsRes.data.lectureSlots || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (
    field: keyof TimetableFormValues,
    value: number | undefined,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.sectionId) errors.sectionId = "Section is required.";
    if (!values.subjectId) errors.subjectId = "Subject is required.";
    if (!values.teacherId) errors.teacherId = "Teacher is required.";
    if (!values.lectureSlotId)
      errors.lectureSlotId = "Lecture slot is required.";
    if (!values.dayOfWeek) errors.dayOfWeek = "Day of week is required.";
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
      <div>
        <label
          htmlFor="sectionId"
          className="block text-sm font-medium text-slate-700"
        >
          Section
        </label>
        <select
          id="sectionId"
          name="sectionId"
          value={values.sectionId || ""}
          onChange={(e) =>
            handleChange(
              "sectionId",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Section"}</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
              {section.className ? ` (${section.className})` : ""}
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
          name="subjectId"
          value={values.subjectId}
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
          name="teacherId"
          value={values.teacherId}
          onChange={(e) => handleChange("teacherId", Number(e.target.value))}
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Teacher"}</option>
          {teachers
            .filter((teacher) => teacher.profileId !== undefined)
            .map((teacher) => (
              <option key={teacher.profileId} value={teacher.profileId}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
        </select>
        {fieldErrors.teacherId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.teacherId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="lectureSlotId"
          className="block text-sm font-medium text-slate-700"
        >
          Lecture Slot
        </label>
        <select
          id="lectureSlotId"
          name="lectureSlotId"
          value={values.lectureSlotId}
          onChange={(e) =>
            handleChange("lectureSlotId", Number(e.target.value))
          }
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">
            {loading ? "Loading..." : "Select Lecture Slot"}
          </option>
          {lectureSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.title}
            </option>
          ))}
        </select>
        {fieldErrors.lectureSlotId && (
          <p className="mt-1 text-sm text-rose-600">
            {fieldErrors.lectureSlotId}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="dayOfWeek"
          className="block text-sm font-medium text-slate-700"
        >
          Day of Week
        </label>
        <select
          id="dayOfWeek"
          name="dayOfWeek"
          value={values.dayOfWeek}
          onChange={(e) => handleChange("dayOfWeek", Number(e.target.value))}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Day of Week</option>
          {DAYS_OF_WEEK.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
        {fieldErrors.dayOfWeek && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.dayOfWeek}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="roomId"
          className="block text-sm font-medium text-slate-700"
        >
          Room (Optional)
        </label>
        <select
          id="roomId"
          name="roomId"
          value={values.roomId || ""}
          onChange={(e) =>
            handleChange(
              "roomId",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Room"}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.roomName}
            </option>
          ))}
        </select>
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
