// ========================================
// 🎯 MAIN ENTRY POINT WITH ALIASED IMPORTS
// ========================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Context providers using aliases
import { TaskProvider } from '@context/TaskContext';
import { PipelineProvider } from '@context/PipelineContext';
import { RoleProvider } from '@context/RoleContext';
import { UserProvider } from '@context/UserContext';

// App component
import App from './App';

// Global styles
import '@styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
      <RoleProvider>
        <TaskProvider>
          <PipelineProvider>
            <App />
          </PipelineProvider>
        </TaskProvider>
      </RoleProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
