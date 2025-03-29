import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth.api";
import { tokenService } from "../../services/tokenService";

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      const { access_token, refresh_token } = response;
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      // After successful login, fetch user info
      return { accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Clear tokens from local storage
     await authApi.logout(tokenService.getRefreshToken()).then(()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
      // Optionally, reset user state
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
);
// Get initial state from localStorage
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setCredentials, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;
