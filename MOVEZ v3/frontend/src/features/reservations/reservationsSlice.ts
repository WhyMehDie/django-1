import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export interface Terrain {
  id: number;
  name: string;
  sport: string;
  address: string;
  city: string;
  price_per_hour: string;
  capacity: number;
  description: string;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
}

export interface Reservation {
  id: number;
  player: number;
  reservation_type: 'TERRAIN' | 'COACHING';
  terrain: number | null;
  terrain_detail: Terrain | null;
  date: string;
  start_time: string;
  end_time: string;
  total_price: string;
  status: string;
  is_paid: boolean;
  split_payment: boolean;
  notes: string;
}

interface ReservationsState {
  terrains: Terrain[];
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationsState = {
  terrains: [],
  reservations: [],
  loading: false,
  error: null,
};

export const fetchTerrains = createAsyncThunk(
  'reservations/fetchTerrains',
  async (params?: Record<string, string>) => {
    const res = await axiosInstance.get('/reservations/terrains/', { params });
    return res.data;
  }
);

export const fetchMyReservations = createAsyncThunk(
  'reservations/fetchMyReservations',
  async () => {
    const res = await axiosInstance.get('/reservations/reservations/');
    return res.data;
  }
);

export const createReservation = createAsyncThunk(
  'reservations/createReservation',
  async (data: Partial<Reservation>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/reservations/reservations/', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const cancelReservation = createAsyncThunk(
  'reservations/cancelReservation',
  async (id: number) => {
    await axiosInstance.post(`/reservations/reservations/${id}/cancel/`);
    return id;
  }
);

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerrains.pending, (state) => { state.loading = true; })
      .addCase(fetchTerrains.fulfilled, (state, action) => {
        state.loading = false;
        state.terrains = action.payload.results || action.payload;
      })
      .addCase(fetchMyReservations.fulfilled, (state, action) => {
        state.reservations = action.payload.results || action.payload;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.unshift(action.payload);
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const r = state.reservations.find(r => r.id === action.payload);
        if (r) r.status = 'CANCELLED';
      });
  },
});

export default reservationsSlice.reducer;
