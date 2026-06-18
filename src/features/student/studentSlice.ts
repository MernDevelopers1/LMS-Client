import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  registrationNo?: string;
  admissionNo?: string;
  gender?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  address?: string;
};

type StudentState = {
  students: Student[];
  selectedStudent: Student | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchStudents = createAsyncThunk(
  "student/fetchStudents",
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
        `/students?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch students",
      );
    }
  },
);

export const fetchStudentById = createAsyncThunk(
  "student/fetchStudentById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/students/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch student",
      );
    }
  },
);

export const createStudent = createAsyncThunk(
  "student/createStudent",
  async (payload: Partial<Student> & { password: string }, thunkAPI) => {
    try {
      const response = await apiClient.request("/students", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create student",
      );
    }
  },
);

export const updateStudent = createAsyncThunk(
  "student/updateStudent",
  async ({ id, ...payload }: Partial<Student> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update student",
      );
    }
  },
);

export const deleteStudent = createAsyncThunk(
  "student/deleteStudent",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/students/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete student",
      );
    }
  },
);

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setSelectedStudent(state, action) {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent(state) {
      state.selectedStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload.students;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createStudent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students.unshift(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateStudent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedStudent = action.payload;
        state.students = state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student,
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = state.students.filter(
          (student) => student.id !== action.payload,
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStudent, clearSelectedStudent } =
  studentSlice.actions;
export default studentSlice.reducer;
