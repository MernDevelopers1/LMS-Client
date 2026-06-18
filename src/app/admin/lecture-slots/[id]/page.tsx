"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LectureSlotForm from "@/components/LectureSlotForm";
import {
  fetchLectureSlotById,
  updateLectureSlot,
  clearSelectedLectureSlot,
} from "@/features/lectureSlot/lectureSlotSlice";
import { AppDispatch, RootState } from "@/store/store";

const EditLectureSlotPage = () => {
  const params = useParams();
  const id = parseInt(params.id as string);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedLectureSlot, status, error } = useSelector(
    (state: RootState) => state.lectureSlot
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchLectureSlotById(id));
    }

    return () => {
      dispatch(clearSelectedLectureSlot());
    };
  }, [dispatch, id]);

  const handleSubmit = async (values: {
    title: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      const result = await dispatch(
        updateLectureSlot({ id, ...values })
      ).unwrap();
      if (result) {
        router.push("/admin/lecture-slots");
      }
    } catch (err) {
      console.error("Error updating lecture slot:", err);
    }
  };

  if (status === "loading" && !selectedLectureSlot) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-slate-200">
        <p>Loading lecture slot details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-slate-200">
      <div className="mb-6">
        <Link href="/admin/lecture-slots" className="text-blue-600 hover:underline text-sm">
          ← Back to Lecture Slots
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit Lecture Slot</h1>
      </div>

      {selectedLectureSlot && (
        <LectureSlotForm
          initialValues={{
            title: selectedLectureSlot.title,
            startTime: selectedLectureSlot.startTime,
            endTime: selectedLectureSlot.endTime,
          }}
          isLoading={status === "loading"}
          error={error}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EditLectureSlotPage;
