// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  // Safely get initial theme preference (localStorage or system)
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Apply theme by toggling `dark` class on <html>
  const applyTheme = useCallback((isDark) => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, []);

  // Apply theme on mount and when `darkMode` changes
  useEffect(() => {
    applyTheme(darkMode);
  }, [darkMode, applyTheme]);

  // Listen to system theme change if no theme is stored
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, []);

  // Toggle theme manually
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return {
    darkMode,               // boolean
    theme: darkMode ? 'dark' : 'light', // string version
    toggleTheme,
    setDarkMode,
  };
}
