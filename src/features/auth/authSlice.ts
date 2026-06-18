import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  profileImage?: string;
};

type ApiUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  phone?: string;
  profileImage?: string;
  profile_image?: string;
};

function normalizeUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName || user.first_name || "",
    lastName: user.lastName || user.last_name || "",
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage || user.profile_image,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export type AuthState = {
  user: null | AuthUser;
  status: "idle" | "loading" | "succeeded" | "failed";
  initialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  initialized: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.request("/auth/me", {
        method: "GET",
      });
      return normalizeUser(response.data);
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue({
        message: getErrorMessage(error, "Unable to fetch current user"),
        status:
          error && typeof error === "object" && "status" in error
            ? Number(error.status)
            : 0,
      });
    }
  },
);

export const loginStudent = createAsyncThunk(
  "auth/loginStudent",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.request("/auth/login/student", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return normalizeUser(response.data.user);
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const loginTeacher = createAsyncThunk(
  "auth/loginTeacher",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.request("/auth/login/teacher", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return normalizeUser(response.data.user);
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await apiClient.request("/auth/login/admin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return normalizeUser(response.data.user);
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await apiClient.request("/auth/logout", {
        method: "POST",
      });
      return;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth(state) {
      state.user = null;
      state.status = "idle";
      state.initialized = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.initialized = true;
        const payload = action.payload as
          | { message: string; status?: number }
          | string;
        if (typeof payload === "object" && payload.status === 401) {
          state.error = null;
        } else {
          state.error = typeof payload === "string" ? payload : payload.message;
        }
      })
      .addCase(loginStudent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginTeacher.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
