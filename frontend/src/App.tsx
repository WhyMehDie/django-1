import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { useEffect } from 'react';
import { fetchProfile } from './features/auth/authSlice';
import { AuthModalProvider } from './context/AuthModalContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MatchmakingPage from './pages/MatchmakingPage';
import ReservationsPage from './pages/ReservationsPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MapPage from './pages/MapPage';
import RankingPage from './pages/RankingPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAppSelector((s) => s.auth);
  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (accessToken) dispatch(fetchProfile());
  }, [accessToken, dispatch]);

  return (
    <BrowserRouter>
      {/* Login modal available on every page */}
      <LoginModal />

      <Routes>
        {/* Public — browsable without login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ranking" element={<><Navbar /><RankingPage /></>} />

        {/* Protected — require login */}
        <Route path="/dashboard" element={<ProtectedRoute><Navbar /><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Navbar /><ProfilePage /></ProtectedRoute>} />
        <Route path="/matchmaking" element={<ProtectedRoute><Navbar /><MatchmakingPage /></ProtectedRoute>} />
        <Route path="/organizer"   element={<ProtectedRoute><Navbar /><OrganizerDashboardPage /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><Navbar /><ReservationsPage /></ProtectedRoute>} />
        <Route path="/tournaments"  element={<ProtectedRoute><Navbar /><TournamentsPage /></ProtectedRoute>} />
        <Route path="/tournaments/:id" element={<ProtectedRoute><Navbar /><TournamentDetailPage /></ProtectedRoute>} />
        <Route path="/map"   element={<ProtectedRoute><Navbar /><MapPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Navbar /><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Navbar /><SettingsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthModalProvider>
        <AppRoutes />
      </AuthModalProvider>
    </Provider>
  );
}
