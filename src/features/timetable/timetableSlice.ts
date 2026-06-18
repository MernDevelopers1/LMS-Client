import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Timetable = {
  id: number;
  classId?: number;
  className?: string;
  subjectId: number;
  subjectName?: string;
  teacherId: number;
  teacherName?: string;
  roomId?: number;
  roomName?: string;
  lectureSlotId: number;
  lectureSlotTitle?: string;
  startTime?: string;
  endTime?: string;
  dayOfWeek: number;
};

type TimetableState = {
  timetables: Timetable[];
  selectedTimetable: Timetable | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: TimetableState = {
  timetables: [],
  selectedTimetable: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchTimetables = createAsyncThunk(
  "timetable/fetchTimetables",
  async (
    params: { page?: number; limit?: number; search?: string } = {},
    thunkAPI,
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));
      if (params.search) query.append("search", params.search);

      const response = await apiClient.request(
        `/timetables?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch timetables",
      );
    }
  },
);

export const fetchTimetableById = createAsyncThunk(
  "timetable/fetchTimetableById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/timetables/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch timetable",
      );
    }
  },
);

export const createTimetable = createAsyncThunk(
  "timetable/createTimetable",
  async (payload: Partial<Timetable>, thunkAPI) => {
    try {
      const response = await apiClient.request("/timetables", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create timetable",
      );
    }
  },
);

export const updateTimetable = createAsyncThunk(
  "timetable/updateTimetable",
  async ({ id, ...payload }: Partial<Timetable> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/timetables/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update timetable",
      );
    }
  },
);

export const deleteTimetable = createAsyncThunk(
  "timetable/deleteTimetable",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/timetables/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete timetable",
      );
    }
  },
);

const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {
    setSelectedTimetable(state, action) {
      state.selectedTimetable = action.payload;
    },
    clearSelectedTimetable(state) {
      state.selectedTimetable = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetables.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTimetables.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timetables = action.payload.timetables;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTimetables.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchTimetableById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTimetableById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTimetable = action.payload;
      })
      .addCase(fetchTimetableById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createTimetable.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTimetable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timetables.unshift(action.payload);
      })
      .addCase(createTimetable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateTimetable.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTimetable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTimetable = action.payload;
        state.timetables = state.timetables.map((timetable) =>
          timetable.id === action.payload.id ? action.payload : timetable,
        );
      })
      .addCase(updateTimetable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteTimetable.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTimetable.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.timetables = state.timetables.filter(
          (timetable) => timetable.id !== action.payload,
        );
      })
      .addCase(deleteTimetable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTimetable, clearSelectedTimetable } =
  timetableSlice.actions;
export default timetableSlice.reducer;
