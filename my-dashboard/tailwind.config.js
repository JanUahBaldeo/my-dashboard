/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode via class="dark"
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981', // teal-500
          dark: '#0f766e',    // teal-700
        },
        surface: {
          light: '#ffffff',
          dark: '#1f2937', // gray-800
        },
        stage: {
          application: '#14b8a6', // teal-500
          approval: '#6b7280',    // gray-500
          processing: '#0ea5e9',  // sky-500
          underwriting: '#f43f5e', // rose-500
          conditional: '#facc15',  // yellow-400
          docs: '#84cc16',         // lime-500
          postclose: '#6366f1',    // indigo-500
        },
        status: {
          track: '#22c55e',     // green-500
          delayed: '#fbbf24',   // yellow-400
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
