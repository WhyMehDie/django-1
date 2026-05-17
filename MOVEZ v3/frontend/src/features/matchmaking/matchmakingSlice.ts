import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export interface PlayerPublic {
  id: number;
  full_name: string;
  role: string;
  avatar: string | null;
  sport: string;
  city: string;
  elo_rating: number;
  average_rating: number | null;
}

interface MatchmakingState {
  players: PlayerPublic[];
  ranking: PlayerPublic[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchmakingState = {
  players: [],
  ranking: [],
  loading: false,
  error: null,
};

export const searchPlayers = createAsyncThunk(
  'matchmaking/searchPlayers',
  async (params: Record<string, string>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/matchmaking/search/', { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchRanking = createAsyncThunk(
  'matchmaking/fetchRanking',
  async (sport?: string, { rejectWithValue }: any = {}) => {
    try {
      const res = await axiosInstance.get('/matchmaking/ranking/', { params: sport ? { sport } : {} });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const sendMatchRequest = createAsyncThunk(
  'matchmaking/sendMatchRequest',
  async (data: { receiver: number; sport: string; message?: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/matchmaking/requests/', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const evaluatePlayer = createAsyncThunk(
  'matchmaking/evaluatePlayer',
  async (data: { evaluated: number; rating: number; comment?: string; sport?: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/matchmaking/evaluate/', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchPlayers.pending, (state) => { state.loading = true; })
      .addCase(searchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload.results || action.payload;
      })
      .addCase(searchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.ranking = action.payload.results || action.payload;
      });
  },
});

export default matchmakingSlice.reducer;
