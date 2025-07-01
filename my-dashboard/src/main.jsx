// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { UserProvider } from './context/UserContext';   // ✅ Vite-safe context
import { TaskProvider } from './context/TaskContext';
// import { ThemeProvider } from './hooks/useTheme';    // Optional if using ThemeContext

const Root = () => (
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TaskProvider>
          {/* <ThemeProvider> */}
            <App />
          {/* </ThemeProvider> */}
        </TaskProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
