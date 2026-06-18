"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LectureSlotForm from "@/components/LectureSlotForm";
import { createLectureSlot } from "@/features/lectureSlot/lectureSlotSlice";
import { AppDispatch, RootState } from "@/store/store";

const CreateLectureSlotPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector(
    (state: RootState) => state.lectureSlot
  );

  const handleSubmit = async (values: {
    title: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      const result = await dispatch(createLectureSlot(values)).unwrap();
      if (result) {
        router.push("/admin/lecture-slots");
      }
    } catch (err) {
      console.error("Error creating lecture slot:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-slate-200">
      <div className="mb-6">
        <Link href="/admin/lecture-slots" className="text-blue-600 hover:underline text-sm">
          ← Back to Lecture Slots
        </Link>
        <h1 className="text-2xl font-bold mt-2">Create New Lecture Slot</h1>
      </div>

      <LectureSlotForm
        isLoading={status === "loading"}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateLectureSlotPage;
