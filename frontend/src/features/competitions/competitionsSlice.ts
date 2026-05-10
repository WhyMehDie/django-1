import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export interface Tournament {
  id: number;
  name: string;
  sport: string;
  format: string;
  status: string;
  max_participants: number;
  participants_count: number;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  prize: string;
  matches?: Match[];
}

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
}

export interface Match {
  id: number;
  tournament: number;
  round_number: number;
  match_number: number;
  player1: number | null;
  player2: number | null;
  winner: number | null;
  score_player1: number | null;
  score_player2: number | null;
  status: string;
  player1_detail?: { full_name: string };
  player2_detail?: { full_name: string };
  winner_detail?: { full_name: string };
}

interface CompetitionsState {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  sponsors: Sponsor[];
  loading: boolean;
  error: string | null;
}

const initialState: CompetitionsState = {
  tournaments: [],
  selectedTournament: null,
  sponsors: [],
  loading: false,
  error: null,
};

export const fetchTournaments = createAsyncThunk(
  'competitions/fetchTournaments',
  async (params?: Record<string, string>) => {
    const res = await axiosInstance.get('/competitions/tournaments/', { params });
    return res.data;
  }
);

export const fetchSponsors = createAsyncThunk(
  'competitions/fetchSponsors',
  async () => {
    const res = await axiosInstance.get('/competitions/sponsors/');
    return res.data;
  }
);

export const fetchTournamentDetail = createAsyncThunk(
  'competitions/fetchTournamentDetail',
  async (id: number) => {
    const res = await axiosInstance.get(`/competitions/tournaments/${id}/bracket/`);
    return res.data;
  }
);

export const createTournament = createAsyncThunk(
  'competitions/createTournament',
  async (data: Partial<Tournament>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/competitions/tournaments/', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const registerForTournament = createAsyncThunk(
  'competitions/register',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/competitions/tournaments/${id}/register/`);
      return { id, participant: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const generateBracket = createAsyncThunk(
  'competitions/generateBracket',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/competitions/tournaments/${id}/generate-bracket/`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateMatchScore = createAsyncThunk(
  'competitions/updateMatchScore',
  async ({ matchId, score_player1, score_player2 }: { matchId: number; score_player1: number; score_player2: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/competitions/matches/${matchId}/score/`, { score_player1, score_player2 });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const competitionsSlice = createSlice({
  name: 'competitions',
  initialState,
  reducers: {
    clearSelectedTournament(state) { state.selectedTournament = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => { state.loading = true; })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload.results || action.payload;
      })
      .addCase(fetchTournamentDetail.fulfilled, (state, action) => {
        state.selectedTournament = action.payload;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.tournaments.unshift(action.payload);
      })
      .addCase(updateMatchScore.fulfilled, (state, action) => {
        if (state.selectedTournament?.matches) {
          const idx = state.selectedTournament.matches.findIndex(m => m.id === action.payload.id);
          if (idx !== -1) state.selectedTournament.matches[idx] = action.payload;
        }
      })
      .addCase(fetchSponsors.fulfilled, (state, action) => {
        state.sponsors = action.payload.results || action.payload;
      });
  },
});

export const { clearSelectedTournament } = competitionsSlice.actions;
export default competitionsSlice.reducer;
