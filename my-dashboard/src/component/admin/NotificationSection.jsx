// src/components/NotificationSection.jsx
import React from 'react';
import { FaClock } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';

const notifications = [
  {
    color: 'green',
    label: 'LOREM IPSUM DOLOR',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    time: '29 July, 2025 at 8:00am',
  },
  {
    color: 'green',
    label: 'LOREM IPSUM DOLOR',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    time: '28 July, 2025 at 1:15pm',
  },
  {
    color: 'yellow',
    label: 'LOREM IPSUM DOLOR',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    time: '28 July, 2025 at 1:45pm',
  },
];

const NotificationSection = () => {
  const { darkMode } = useTheme(); // read from custom hook

  return (
    <section className="pt-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1827/1827349.png"
          alt="bell"
          className="w-6 h-6"
        />
        Notifications
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((n, i) => (
          <li
            key={i}
            className={`py-4 px-2 flex items-start justify-between transition duration-200 rounded-md ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-1 w-2 h-2 rounded-full ${
                  n.color === 'green'
                    ? 'bg-green-400 animate-pulse'
                    : n.color === 'yellow'
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
              ></span>
              <div>
                <span
                  className={`inline-block text-xs text-white font-semibold px-3 py-0.5 rounded-full mb-1 ${
                    n.color === 'green'
                      ? 'bg-green-600'
                      : n.color === 'yellow'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                >
                  {n.label}
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {n.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {n.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <FaClock className="text-base" />
              <span>{n.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationSection;
