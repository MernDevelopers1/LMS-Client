"use client";

import React, { useState, useEffect } from "react";

interface LectureSlotFormProps {
  initialValues?: {
    title?: string;
    startTime?: string;
    endTime?: string;
  };
  isLoading?: boolean;
  error?: string | null;
  onSubmit: (values: {
    title: string;
    startTime: string;
    endTime: string;
  }) => void;
}

const LectureSlotForm: React.FC<LectureSlotFormProps> = ({
  initialValues,
  isLoading = false,
  error,
  onSubmit,
}) => {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    startTime: initialValues?.startTime || "",
    endTime: initialValues?.endTime || "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    startTime?: string;
    endTime?: string;
  }>({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || "",
        startTime: initialValues.startTime || "",
        endTime: initialValues.endTime || "",
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!values.title || values.title.trim().length === 0) {
      newErrors.title = "Title is required";
    }

    if (!values.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!values.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (values.startTime && values.endTime) {
      const start = new Date(`2000-01-01 ${values.startTime}`);
      const end = new Date(`2000-01-01 ${values.endTime}`);

      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Slot Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g., Slot 1, Morning Session"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-slate-200"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={values.startTime}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startTime ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={values.endTime}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endTime ? "border-red-500" : "border-slate-200"
            }`}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
      >
        {isLoading ? "Saving..." : "Save Lecture Slot"}
      </button>
    </form>
  );
};

export default LectureSlotForm;
