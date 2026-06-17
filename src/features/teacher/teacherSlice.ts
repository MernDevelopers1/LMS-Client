import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  employeeNo?: string;
  designation?: string;
  qualification?: string;
  joiningDate?: string;
  address?: string;
};

type TeacherState = {
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchTeachers = createAsyncThunk(
  "teacher/fetchTeachers",
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
        `/teachers?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch teachers",
      );
    }
  },
);

export const fetchTeacherById = createAsyncThunk(
  "teacher/fetchTeacherById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/teachers/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch teacher",
      );
    }
  },
);

export const createTeacher = createAsyncThunk(
  "teacher/createTeacher",
  async (payload: Partial<Teacher> & { password: string }, thunkAPI) => {
    try {
      const response = await apiClient.request("/teachers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create teacher",
      );
    }
  },
);

export const updateTeacher = createAsyncThunk(
  "teacher/updateTeacher",
  async ({ id, ...payload }: Partial<Teacher> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update teacher",
      );
    }
  },
);

export const deleteTeacher = createAsyncThunk(
  "teacher/deleteTeacher",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/teachers/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete teacher",
      );
    }
  },
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setSelectedTeacher(state, action) {
      state.selectedTeacher = action.payload;
    },
    clearSelectedTeacher(state) {
      state.selectedTeacher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload.teachers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchTeacherById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers.unshift(action.payload);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTeacher = action.payload;
        state.teachers = state.teachers.map((teacher) =>
          teacher.id === action.payload.id ? action.payload : teacher,
        );
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = state.teachers.filter(
          (teacher) => teacher.id !== action.payload,
        );
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTeacher, clearSelectedTeacher } =
  teacherSlice.actions;
export default teacherSlice.reducer;
