import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

import * as Tooltip from '@radix-ui/react-tooltip';

import DashboardPage from './pages/DashboardPage';
import CalendarPage from '../my-dashboard/src/pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AdminDashboard } from './components/features/admin';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import './styles/index.css';

// 🔐 Route Guard
const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen w-full font-sans animate-fade-in bg-neutral-50 text-neutral-900">
      <Tooltip.Provider>
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔐 Protected User Routes */}
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
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Admin Route */}
          <Route
            path="/admin-dashboard/:userId"
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

          {/* 🔐 Partner Route */}
          <Route
            path="/partner-dashboard/:userId"
            element={
              user?.tier === 'Production Partner' ? (
                <ProtectedRoute>
                  <PartnerDashboardPage />
                </ProtectedRoute>
              ) : (
                <Navigate to="/unauthorized" replace />
              )
            }
          />

          {/* ❌ Unauthorized */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* 🔁 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Tooltip.Provider>
    </div>
  );
};

export default App; 