import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type Section = {
  id: number;
  name: string;
  capacity?: number;
  classId: number;
  className?: string;
  academicYearId?: number;
  academicYearTitle?: string;
};

type SectionState = {
  sections: Section[];
  selectedSection: Section | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
};

const initialState: SectionState = {
  sections: [],
  selectedSection: null,
  status: "idle",
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    pages: 0,
    total: 0,
  },
};

export const fetchSections = createAsyncThunk(
  "section/fetchSections",
  async (
    params: { page?: number; limit?: number; search?: string; classId?: number } = {},
    thunkAPI,
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append("page", String(params.page));
      if (params.limit) query.append("limit", String(params.limit));
      if (params.search) query.append("search", params.search);
      if (params.classId) query.append("classId", String(params.classId));

      const response = await apiClient.request(
        `/sections?${query.toString()}`,
        {
          method: "GET",
        },
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch sections",
      );
    }
  },
);

export const fetchSectionById = createAsyncThunk(
  "section/fetchSectionById",
  async (id: number, thunkAPI) => {
    try {
      const response = await apiClient.request(`/sections/${id}`, {
        method: "GET",
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to fetch section",
      );
    }
  },
);

export const createSection = createAsyncThunk(
  "section/createSection",
  async (payload: Partial<Section>, thunkAPI) => {
    try {
      const response = await apiClient.request("/sections", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to create section",
      );
    }
  },
);

export const updateSection = createAsyncThunk(
  "section/updateSection",
  async ({ id, ...payload }: Partial<Section> & { id: number }, thunkAPI) => {
    try {
      const response = await apiClient.request(`/sections/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to update section",
      );
    }
  },
);

export const deleteSection = createAsyncThunk(
  "section/deleteSection",
  async (id: number, thunkAPI) => {
    try {
      await apiClient.request(`/sections/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || "Unable to delete section",
      );
    }
  },
);

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    setSelectedSection(state, action) {
      state.selectedSection = action.payload;
    },
    clearSelectedSection(state) {
      state.selectedSection = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections = action.payload.sections;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchSectionById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSectionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSection = action.payload;
      })
      .addCase(fetchSectionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createSection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections.unshift(action.payload);
      })
      .addCase(createSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateSection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSection = action.payload;
        state.sections = state.sections.map((section) =>
          section.id === action.payload.id ? action.payload : section,
        );
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteSection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections = state.sections.filter(
          (section) => section.id !== action.payload,
        );
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedSection, clearSelectedSection } = sectionSlice.actions;
export default sectionSlice.reducer;
