"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks";
import {
  fetchRoomById,
  updateRoom,
  clearSelectedRoom,
} from "../../../../../../features/room/roomSlice";
import RoomForm from "../../../../../../components/RoomForm";

export default function EditRoomPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const routeId = params?.id;
  const roomId =
    typeof routeId === "string"
      ? Number(routeId)
      : Array.isArray(routeId)
        ? Number(routeId[0])
        : 0;
  const { selectedRoom, status, error } = useAppSelector((state) => state.room);

  useEffect(() => {
    if (roomId > 0) {
      dispatch(fetchRoomById(roomId));
    }
    return () => {
      dispatch(clearSelectedRoom());
    };
  }, [dispatch, roomId]);

  const handleSubmit = async (values: any) => {
    if (!roomId) return;
    const result = await dispatch(updateRoom({ id: roomId, ...values }));
    if (updateRoom.fulfilled.match(result)) {
      router.push("/admin/dashboard/rooms");
    }
  };

  if (status === "loading" && !selectedRoom) {
    return <div className="p-8 text-slate-600">Loading room details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit Room</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update room details and capacity information.
        </p>
      </div>
      {selectedRoom ? (
        <RoomForm
          initialValues={{
            roomNo: selectedRoom.roomNo,
            roomName: selectedRoom.roomName || "",
            building: selectedRoom.building || "",
            capacity: selectedRoom.capacity,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          status={status}
          error={error}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          Room not found.
        </div>
      )}
    </div>
  );
}
