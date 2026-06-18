import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Class = {
  id: number;
  name: string;
  description?: string;
  academicYearId?: number;
  academicYearTitle?: string;
};

type ClassState = {
  classes: Class[];
  selectedClass: Class | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
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
        `/classes?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch classes",
      );
    }
  },
);

export const fetchClassById = createAsyncThunk(
  "class/fetchClassById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/classes/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch class",
      );
    }
  },
);

export const createClass = createAsyncThunk(
  "class/createClass",
  async (payload: Partial<Class>, thunkAPI) => {
    try {
      const response = await apiClient.request("/classes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create class",
      );
    }
  },
);

export const updateClass = createAsyncThunk(
  "class/updateClass",
  async ({ id, ...payload }: Partial<Class> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update class",
      );
    }
  },
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/classes/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete class",
      );
    }
  },
);

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setSelectedClass(state, action) {
      state.selectedClass = action.payload;
    },
    clearSelectedClass(state) {
      state.selectedClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classes = action.payload.classes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchClassById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classes.unshift(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedClass = action.payload;
        state.classes = state.classes.map((classItem) =>
          classItem.id === action.payload.id ? action.payload : classItem,
        );
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteClass.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.classes = state.classes.filter(
          (classItem) => classItem.id !== action.payload,
        );
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedClass, clearSelectedClass } = classSlice.actions;
export default classSlice.reducer;
