import { useState } from "react";
import FormInput from "./FormInput";

type RoomFormValues = {
  roomNo: string;
  roomName?: string;
  building?: string;
  capacity?: number;
};

type RoomFormProps = {
  initialValues: RoomFormValues;
  onSubmit: (values: RoomFormValues) => Promise<void>;
  submitLabel: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

export default function RoomForm({
  initialValues,
  onSubmit,
  submitLabel,
  status,
  error,
}: RoomFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof RoomFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.roomNo.trim()) errors.roomNo = "Room number is required.";
    if (
      values.capacity !== undefined &&
      values.capacity !== null &&
      (Number.isNaN(Number(values.capacity)) || Number(values.capacity) <= 0)
    ) {
      errors.capacity = "Capacity must be a positive number.";
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
        label="Room Number"
        id="roomNo"
        name="roomNo"
        value={values.roomNo}
        placeholder="A101"
        onChange={(value) => handleChange("roomNo", value)}
        error={fieldErrors.roomNo}
      />

      <FormInput
        label="Room Name"
        id="roomName"
        name="roomName"
        value={values.roomName || ""}
        placeholder="Physics Lab"
        onChange={(value) => handleChange("roomName", value)}
        error={fieldErrors.roomName}
      />

      <FormInput
        label="Building"
        id="building"
        name="building"
        value={values.building || ""}
        placeholder="Main Block"
        onChange={(value) => handleChange("building", value)}
        error={fieldErrors.building}
      />

      <FormInput
        label="Capacity (Optional)"
        id="capacity"
        name="capacity"
        type="number"
        value={
          values.capacity !== undefined && values.capacity !== null
            ? String(values.capacity)
            : ""
        }
        placeholder="40"
        onChange={(value) =>
          handleChange(
            "capacity",
            value ? Number(value) : undefined,
          )
        }
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
