import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ObservationsPage from './pages/ObservationsPage';
import ConditionsPage from './pages/ConditionsPage';
import MedicationsPage from './pages/MedicationsPage';
import AllergiesPage from './pages/AllergiesPage';
import AppointmentsPage from './pages/AppointmentsPage';


const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const toastShown = React.useRef(false);
  useEffect(() => {
    const loginStatus = searchParams.get('login');
    if (loginStatus === 'success' && !toastShown.current) {
      toast.success('Successfully logged in!');
      toastShown.current = true;
      // Remove the query parameter using navigate to avoid page reload
      navigate('/dashboard', { replace: true });
    } else if (!loginStatus) {
      toastShown.current = false;
    }
  }, [searchParams, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/observations"
        element={
          <ProtectedRoute>
            <ObservationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conditions"
        element={
          <ProtectedRoute>
            <ConditionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medications"
        element={
          <ProtectedRoute>
            <MedicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/allergies"
        element={
          <ProtectedRoute>
            <AllergiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
