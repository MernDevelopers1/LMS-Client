"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchRoomById, clearSelectedRoom } from "@/features/room/roomSlice";
import { DetailPageHeader, DetailPageTabs } from "@/components/detail";
import Button from "@/components/Button";

export default function RoomDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? Number(params.id) : 0;
  const dispatch = useAppDispatch();
  const { selectedRoom, status } = useAppSelector((s) => s.room);

  useEffect(() => {
    if (id) dispatch(fetchRoomById(id));
    return () => dispatch(clearSelectedRoom());
  }, [dispatch, id]);

  if (status === "loading") return <div className="p-4">Loading...</div>;
  if (!selectedRoom) return <div className="p-4">Not found</div>;

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <div className="p-4">Capacity: {selectedRoom.capacity}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title={selectedRoom.name}
        subtitle="Room"
        status="active"
        statusColor="green"
        headerInfo={[
          { label: "Capacity", value: String(selectedRoom.capacity) },
        ]}
        actionButton={
          <Button href={`/admin/dashboard/rooms/${selectedRoom.id}/edit`}>
            Edit
          </Button>
        }
      />
      <DetailPageTabs tabs={tabs} defaultTabId="profile" />
    </div>
  );
}
