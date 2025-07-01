import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useUser } from './context/UserContext';

import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/DashboardPage';
import AdminDashboard from './component/admin/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage'; // ✅ NEW

import './index.css';

// 🔐 Route Guard
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();

  return (
    <div
      className={`min-h-screen w-full font-sans animate-fade-in ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
      }`}
    >
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔐 User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard/:userId"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Route */}
        <Route
          path="/admin"
          element={
            user?.tier === 'Admin' ? (
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        />

        {/* ❌ Unauthorized Fallback */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* 🔁 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
