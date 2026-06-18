"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import {
  fetchRooms,
  deleteRoom,
  setSelectedRoom,
} from "../../../../features/room/roomSlice";
import AdminListPage from "../../../../components/AdminListPage";

const columns = [
  { label: "Room No", key: "roomNo" },
  { label: "Room Name", key: "roomName" },
  { label: "Building", key: "building" },
  { label: "Capacity", key: "capacity" },
];

export default function RoomListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { rooms, status, error, pagination } = useAppSelector(
    (state) => state.room,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("roomNo");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(
      fetchRooms({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sortBy: sortBy ?? undefined,
        sortOrder,
      }),
    );
  }, [dispatch, currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    const nextSortOrder =
      sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(key);
    setSortOrder(nextSortOrder);
    setCurrentPage(1);
  };

  const handleEdit = (room: any) => {
    dispatch(setSelectedRoom(room));
    router.push(`/admin/dashboard/rooms/${room.id}/edit`);
  };

  const handleDelete = async (room: any) => {
    if (!window.confirm(`Delete room ${room.roomNo}?`)) {
      return;
    }
    const result = await dispatch(deleteRoom(room.id));
    if (deleteRoom.rejected.match(result)) {
      alert(`Cannot delete room: ${result.payload}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <AdminListPage
      title="Room Management"
      description="Create, edit, and manage rooms used for timetable scheduling."
      actionLabel="Add Room"
      actionHref="/admin/dashboard/rooms/new"
      error={error}
      tableProps={{
        columns,
        data: rooms,
        currentPage,
        pageSize,
        totalItems: pagination.total,
        searchText: searchQuery,
        onSearchChange: handleSearch,
        onPageChange: setCurrentPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        onSortChange: handleSort,
        sortKey: sortBy,
        sortDirection: sortOrder,
        onEdit: handleEdit,
        onRowClick: (item: any) => {
          dispatch(setSelectedRoom(item));
          router.push(`/admin/dashboard/rooms/${item.id}/detail`);
        },
        onDelete: handleDelete,
        isLoading: status === "loading",
      }}
    />
  );
}
