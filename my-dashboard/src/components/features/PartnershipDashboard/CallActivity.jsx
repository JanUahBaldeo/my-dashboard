// ========================================
// 🎯 CALL ACTIVITY COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiPhoneCall,
  FiVoicemail,
  FiClock,
  FiCalendar,
  FiTrendingUp,
} from 'react-icons/fi';

const CallActivity = () => {
  const [callFilter, setCallFilter] = useState('All');

  const callStats = [
    {
      label: 'Total Calls',
      value: '247',
      change: '+12%',
      changeType: 'positive',
      subtitle: 'vs yesterday',
      icon: FiPhone,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Connected Calls',
      value: '189',
      change: '76.5%',
      changeType: 'rate',
      subtitle: 'connection rate',
      icon: FiPhoneCall,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Voicemails',
      value: '27',
      change: '31',
      changeType: 'secondary',
      subtitle: 'missed calls',
      icon: FiVoicemail,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Average Duration',
      value: '4:32',
      change: '981 / 1490',
      changeType: 'secondary',
      subtitle: 'total duration',
      icon: FiClock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const hourlyData = [
    { hour: '9 AM', connected: 9, other: 2, total: 11 },
    { hour: '10 AM', connected: 14, other: 18, total: 32 },
    { hour: '11 AM', connected: 12, other: 15, total: 27 },
    { hour: '12 PM', connected: 6, other: 8, total: 14 },
    { hour: '1 PM', connected: 7, other: 10, total: 17 },
    { hour: '2 PM', connected: 17, other: 22, total: 39 },
    { hour: '3 PM', connected: 15, other: 19, total: 34 },
    { hour: '4 PM', connected: 13, other: 16, total: 29 },
    { hour: '5 PM', connected: 11, other: 14, total: 25 },
  ];

  const maxCalls = Math.max(...hourlyData.map(d => d.total));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Call Activity
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of call performance and communication metrics
        </p>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {callStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-gray-700`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              {stat.changeType === 'positive' && (
                <div className="flex items-center text-green-500 text-sm">
                  <FiTrendingUp size={14} className="mr-1" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mb-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.changeType === 'rate' ? (
                <span className="text-green-600 font-medium">{stat.change}</span>
              ) : stat.changeType === 'secondary' ? (
                <span>{stat.change}</span>
              ) : null} {stat.subtitle}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hourly Call Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <FiCalendar size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Hourly Call Activity
          </h3>
        </div>

        <div className="space-y-4">
          {hourlyData.map((data, index) => {
            const connectedPercentage = (data.connected / maxCalls) * 100;
            const otherPercentage = (data.other / maxCalls) * 100;

            return (
              <motion.div
                key={data.hour}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4"
              >
                {/* Hour Label */}
                <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {data.hour}
                </div>

                {/* Bar Chart */}
                <div className="flex-1">
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    {/* Connected Calls (Green) */}
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${connectedPercentage}%` }}
                    >
                      {data.connected > 0 && data.connected}
                    </div>

                    {/* Other Calls (Blue) */}
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${otherPercentage}%` }}
                    >
                      {data.other > 0 && data.other}
                    </div>
                  </div>
                </div>

                {/* Connected Count */}
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {data.connected} connected
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Connected Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Other Calls</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallActivity;
