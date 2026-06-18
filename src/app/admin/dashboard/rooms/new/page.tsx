"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import { createRoom } from "../../../../../features/room/roomSlice";
import RoomForm from "../../../../../components/RoomForm";

export default function NewRoomPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.room);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(createRoom(values));
    if (createRoom.fulfilled.match(result)) {
      router.push("/admin/dashboard/rooms");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Add New Room</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create a new room for scheduling timetable entries.
        </p>
      </div>
      <RoomForm
        initialValues={{
          roomNo: "",
          roomName: "",
          building: "",
          capacity: undefined,
        }}
        onSubmit={handleSubmit}
        submitLabel="Create Room"
        status={status}
        error={error}
      />
    </div>
  );
}
