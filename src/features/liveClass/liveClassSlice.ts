import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type LiveClass = {
  id: number;
  sectionId: number;
  sectionName?: string;
  classId?: number;
  className?: string;
  subjectId: number;
  subjectName?: string;
  teacherId: number;
  teacherName?: string;
  title: string;
  description?: string;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  startTime: string;
  durationMinutes: number;
  recordingUrl?: string;
  status: string;
};

type LiveClassState = {
  liveClasses: LiveClass[];
  selectedLiveClass: LiveClass | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: LiveClassState = {
  liveClasses: [],
  selectedLiveClass: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchLiveClasses = createAsyncThunk(
  "liveClass/fetchLiveClasses",
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
        `/live-classes?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch live classes",
      );
    }
  },
);

export const fetchLiveClassById = createAsyncThunk(
  "liveClass/fetchLiveClassById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/live-classes/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch live class",
      );
    }
  },
);

export const createLiveClass = createAsyncThunk(
  "liveClass/createLiveClass",
  async (payload: Partial<LiveClass>, thunkAPI) => {
    try {
      const response = await apiClient.request("/live-classes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create live class",
      );
    }
  },
);

export const updateLiveClass = createAsyncThunk(
  "liveClass/updateLiveClass",
  async (
    { id, ...payload }: Partial<LiveClass> & { id: number },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.request(`/live-classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update live class",
      );
    }
  },
);

export const deleteLiveClass = createAsyncThunk(
  "liveClass/deleteLiveClass",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/live-classes/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete live class",
      );
    }
  },
);

const liveClassSlice = createSlice({
  name: "liveClass",
  initialState,
  reducers: {
    setSelectedLiveClass(state, action) {
      state.selectedLiveClass = action.payload;
    },
    clearSelectedLiveClass(state) {
      state.selectedLiveClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveClasses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLiveClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveClasses = action.payload.liveClasses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLiveClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchLiveClassById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLiveClassById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLiveClass = action.payload;
      })
      .addCase(fetchLiveClassById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createLiveClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createLiveClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveClasses.unshift(action.payload);
      })
      .addCase(createLiveClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateLiveClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateLiveClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLiveClass = action.payload;
        state.liveClasses = state.liveClasses.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateLiveClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteLiveClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteLiveClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.liveClasses = state.liveClasses.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(deleteLiveClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedLiveClass, clearSelectedLiveClass } =
  liveClassSlice.actions;
export default liveClassSlice.reducer;
