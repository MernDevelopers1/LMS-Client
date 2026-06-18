import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Subject = {
  id: number;
  code: string;
  name: string;
  description?: string;
  totalMarks?: number;
  passingMarks?: number;
  createdAt?: string;
  updatedAt?: string;
};

type SubjectState = {
  subjects: Subject[];
  selectedSubject: Subject | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: SubjectState = {
  subjects: [],
  selectedSubject: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
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
        `/subjects?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch subjects",
      );
    }
  },
);

export const fetchSubjectById = createAsyncThunk(
  "subject/fetchSubjectById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/subjects/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch subject",
      );
    }
  },
);

export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (payload: Partial<Subject>, thunkAPI) => {
    try {
      const response = await apiClient.request("/subjects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create subject",
      );
    }
  },
);

export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async ({ id, ...payload }: Partial<Subject> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/subjects/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update subject",
      );
    }
  },
);

export const deleteSubject = createAsyncThunk(
  "subject/deleteSubject",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/subjects/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete subject",
      );
    }
  },
);

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSelectedSubject(state, action) {
      state.selectedSubject = action.payload;
    },
    clearSelectedSubject(state) {
      state.selectedSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subjects = action.payload.subjects;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchSubjectById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createSubject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subjects.unshift(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateSubject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSubject = action.payload;
        state.subjects = state.subjects.map((subject) =>
          subject.id === action.payload.id ? action.payload : subject,
        );
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subjects = state.subjects.filter(
          (subject) => subject.id !== action.payload,
        );
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSubject, clearSelectedSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
