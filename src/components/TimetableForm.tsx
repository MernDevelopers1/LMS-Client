import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import apiClient from "../utils/apiClient";

type TimetableFormValues = {
  classId?: number;
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

  const [classes, setClasses] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [teachers, setTeachers] = useState<
    Array<{ id: number; firstName: string; lastName: string }>
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
        const [classesRes, subjectsRes, teachersRes, roomsRes, slotsRes] =
          await Promise.all([
            apiClient.request("/classes", { method: "GET" }),
            apiClient.request("/subjects", { method: "GET" }),
            apiClient.request("/teachers", { method: "GET" }),
            { data: [] },
            // apiClient.request("/rooms", { method: "GET" }),
            apiClient.request("/lecture-slots", { method: "GET" }),
          ]);
        console.log("classesRes :>> ", classesRes);
        console.log("subjectsRes :>> ", subjectsRes);
        console.log("teachersRes :>> ", teachersRes);
        console.log("roomsRes :>> ", roomsRes);
        console.log("slotsRes :>> ", slotsRes);
        const classData = classesRes.data?.classes ?? classesRes.data ?? [];
        setClasses(Array.isArray(classData) ? classData : []);
        setSubjects(subjectsRes?.data?.subjects || []);
        setTeachers(teachersRes.data.teachers || []);
        setRooms(roomsRes.data || []);
        setLectureSlots(slotsRes.data.lectureSlots || []);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (field: keyof TimetableFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.classId) errors.classId = "Class is required.";
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
          htmlFor="classId"
          className="block text-sm font-medium text-slate-700"
        >
          Class
        </label>
        <select
          id="classId"
          name="classId"
          value={values.classId || ""}
          onChange={(e) =>
            handleChange(
              "classId",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          disabled={loading}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
        >
          <option value="">{loading ? "Loading..." : "Select Class"}</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {fieldErrors.classId && (
          <p className="mt-1 text-sm text-rose-600">{fieldErrors.classId}</p>
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
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
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
