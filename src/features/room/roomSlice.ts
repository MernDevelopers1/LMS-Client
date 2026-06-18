import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Room = {
  id: number;
  roomNo: string;
  roomName?: string;
  building?: string;
  capacity?: number;
};

type RoomState = {
  rooms: Room[];
  selectedRoom: Room | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchRooms = createAsyncThunk(
  "room/fetchRooms",
  async (
    params: { page?: number; limit?: number; search?: string } = {},
    thunkAPI,
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));
      if (params.search) query.append("search", params.search);

      const response = await apiClient.request(`/rooms?${query.toString()}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message || "Unable to fetch rooms");
    }
  },
);

export const fetchRoomById = createAsyncThunk(
  "room/fetchRoomById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/rooms/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message || "Unable to fetch room");
    }
  },
);

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (payload: Partial<Room>, thunkAPI) => {
    try {
      const response = await apiClient.request("/rooms", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message || "Unable to create room");
    }
  },
);

export const updateRoom = createAsyncThunk(
  "room/updateRoom",
  async ({ id, ...payload }: Partial<Room> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message || "Unable to update room");
    }
  },
);

export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/rooms/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message || "Unable to delete room");
    }
  },
);

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setSelectedRoom(state, action) {
      state.selectedRoom = action.payload;
    },
    clearSelectedRoom(state) {
      state.selectedRoom = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload.rooms;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms.unshift(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRoom = action.payload;
        state.rooms = state.rooms.map((room) =>
          room.id === action.payload.id ? action.payload : room,
        );
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRoom, clearSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
