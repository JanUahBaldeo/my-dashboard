// ========================================
// 🎯 APP COMPONENT WITH NEW STRUCTURE
// ========================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';

// Pages
import {
  DashboardPage,
  AdminDashboardPage,
  PartnerDashboardPage,
  CalendarPage,
  TaskManagementPage,
} from '@pages';

// Components
import { ErrorBoundary } from '@shared/components';
import TimezoneDebugComponent from './src/components/debug/TimezoneDebugComponent';
import TimezoneApiDebugComponent from './src/components/debug/TimezoneApiDebugComponent';

// Hooks
import { useAppInitialization } from '@hooks/useAppInitialization';

const App = () => {
  // Initialize timezone and app settings
  const { isInitialized, isLoading, error, timezone } = useAppInitialization();

  return (
    <ErrorBoundary>
        <Tooltip.Provider>
          <div data-timezone={timezone} data-app-initialized={isInitialized}>
            <Routes>
              {/* Debug Routes */}
              <Route path="/debug/timezone" element={<TimezoneDebugComponent />} />
              <Route path="/debug/timezone-api" element={<TimezoneApiDebugComponent />} />

              {/* Main Routes */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/tasks" element={<TaskManagementPage />} />
              <Route path="/user-dashboard/:userId" element={<DashboardPage />} />
              <Route path="/admin-dashboard/:userId" element={<AdminDashboardPage />} />
              <Route path="/loa-dashboard/:userId" element={<AdminDashboardPage />} />
              <Route path="/partner-dashboard/:userId" element={<PartnerDashboardPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Tooltip.Provider>
    </ErrorBoundary>
  );
};

export default App;
