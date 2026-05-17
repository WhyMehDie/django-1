import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import matchmakingReducer from '../features/matchmaking/matchmakingSlice';
import reservationsReducer from '../features/reservations/reservationsSlice';
import competitionsReducer from '../features/competitions/competitionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matchmaking: matchmakingReducer,
    reservations: reservationsReducer,
    competitions: competitionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
