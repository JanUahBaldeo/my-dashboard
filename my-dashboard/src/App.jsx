// ========================================
// 🎯 APP COMPONENT WITH ALIASED IMPORTS (FIXED BARREL IMPORTS)
// ========================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';

import UserDashboardPage from '@pages/DashboardPage';
import { AdminDashboard } from '@components';
import PartnerDashboardPage from '@pages/PartnerDashboardPage';
import CalendarPage from '@pages/CalendarPage';
import TaskManagementPage from '@pages/TaskManagementPage';
import LOADashboardPage from '@pages/AdminDashboardPage';
import ErrorBoundary from '@ui/ErrorBoundary';

import '@styles/index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full font-sans animate-fade-in bg-gray-50 text-black">
        <Tooltip.Provider>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<UserDashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<TaskManagementPage />} />
            <Route path="/user-dashboard/:userId" element={<UserDashboardPage />} />
            <Route path="/admin-dashboard/:userId" element={<AdminDashboard />} />
            <Route path="/loa-dashboard/:userId" element={<LOADashboardPage />} />
            <Route path="/partner-dashboard/:userId" element={<PartnerDashboardPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Tooltip.Provider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
