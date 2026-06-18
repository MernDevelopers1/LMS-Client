import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

export interface LectureSlot {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
}

export interface LectureSlotState {
  lectureSlots: LectureSlot[];
  selectedLectureSlot: LectureSlot | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
}

const initialState: LectureSlotState = {
  lectureSlots: [],
  selectedLectureSlot: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 1,
    total: 0,
  },
};

export const fetchLectureSlots = createAsyncThunk(
  "lectureSlot/fetchLectureSlots",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {},
    thunkAPI,
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", String(params.page));
      if (params.limit) queryParams.append("limit", String(params.limit));
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await apiClient.request(
        `/lecture-slots?${queryParams.toString()}`,
        {
          method: "GET",
        },
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch lecture slots",
      );
    }
  },
);

export const fetchLectureSlotById = createAsyncThunk(
  "lectureSlot/fetchLectureSlotById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/lecture-slots/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch lecture slot",
      );
    }
  },
);

export const createLectureSlot = createAsyncThunk(
  "lectureSlot/createLectureSlot",
  async (
    payload: { title: string; startTime: string; endTime: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.request("/lecture-slots", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create lecture slot",
      );
    }
  },
);

export const updateLectureSlot = createAsyncThunk(
  "lectureSlot/updateLectureSlot",
  async (
    payload: {
      id: number;
      title?: string;
      startTime?: string;
      endTime?: string;
    },
    thunkAPI,
  ) => {
    try {
      const { id, ...data } = payload;
      const response = await apiClient.request(`/lecture-slots/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update lecture slot",
      );
    }
  },
);

export const deleteLectureSlot = createAsyncThunk(
  "lectureSlot/deleteLectureSlot",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/lecture-slots/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete lecture slot",
      );
    }
  },
);

const lectureSlotSlice = createSlice({
  name: "lectureSlot",
  initialState,
  reducers: {
    clearSelectedLectureSlot: (state) => {
      state.selectedLectureSlot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectureSlots.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLectureSlots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lectureSlots = action.payload.lectureSlots;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLectureSlots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchLectureSlotById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLectureSlotById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLectureSlot = action.payload;
      })
      .addCase(fetchLectureSlotById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(createLectureSlot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createLectureSlot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lectureSlots.unshift(action.payload);
      })
      .addCase(createLectureSlot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(updateLectureSlot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateLectureSlot.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lectureSlots.findIndex(
          (slot) => slot.id === action.payload.id,
        );
        if (index !== -1) {
          state.lectureSlots[index] = action.payload;
        }
        state.selectedLectureSlot = action.payload;
      })
      .addCase(updateLectureSlot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(deleteLectureSlot.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteLectureSlot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lectureSlots = state.lectureSlots.filter(
          (slot) => slot.id !== action.payload,
        );
      })
      .addCase(deleteLectureSlot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedLectureSlot } = lectureSlotSlice.actions;
export default lectureSlotSlice.reducer;
