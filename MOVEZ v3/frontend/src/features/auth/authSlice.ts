import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  avatar: string | null;
  bio: string;
  sport: string;
  city: string;
  phone: string;
  height: number | null;
  weight: number | null;
  position: string;
  instagram: string;
  cover_photo: string | null;
  gallery_1: string | null;
  gallery_2: string | null;
  elo_rating: number;
  average_rating: number | null;
  date_joined: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: Record<string, string>, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/register/`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Erreur lors de l\'inscription');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login/`, credentials);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Identifiants invalides');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/profile/');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch('/auth/profile/', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access;
        state.refreshToken = action.payload.tokens.refresh;
        localStorage.setItem('access_token', action.payload.tokens.access);
        localStorage.setItem('refresh_token', action.payload.tokens.refresh);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = JSON.stringify(action.payload);
      })
      // Login
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = 'Email ou mot de passe incorrect.';
      })
      // Profile
      .addCase(fetchProfile.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
