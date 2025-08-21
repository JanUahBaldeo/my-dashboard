// ========================================
// 📊 CALL DASHBOARD (Combined)
// - KPI cards + Hourly Call Activity + Recent Calls
// - TailwindCSS + Framer Motion + react-icons
// ========================================

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone,
  FiPhoneCall,
  FiVoicemail,
  FiClock,
  FiCalendar,
  FiTrendingUp,
  FiPhoneOff,
  FiUser,
} from 'react-icons/fi';

export default function CallDashboard() {
  // =============================
  // Data (mock)
  // =============================
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

  const calls = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '555-0123',
      status: 'Connected',
      duration: '8:45',
      agent: 'John Smith',
      time: '10:30 AM',
      type: 'connected',
    },
    {
      id: 2,
      name: 'Mike Chen',
      phone: '555-0124',
      status: 'Connected',
      duration: '3:20',
      agent: 'John Smith',
      time: '10:15 AM',
      type: 'connected',
    },
    {
      id: 3,
      name: 'Lisa Wong',
      phone: '555-0125',
      status: 'Voicemail',
      duration: '0:00',
      agent: 'John Smith',
      time: '9:45 AM',
      type: 'voicemail',
    },
    {
      id: 4,
      name: 'David Smith',
      phone: '555-0126',
      status: 'Missed',
      duration: '0:00',
      agent: 'John Smith',
      time: '9:30 AM',
      type: 'missed',
    },
    {
      id: 5,
      name: 'Jennifer Davis',
      phone: '555-0127',
      status: 'Connected',
      duration: '12:15',
      agent: 'John Smith',
      time: '9:00 AM',
      type: 'connected',
    },
  ];

  // =============================
  // Helpers & derived state
  // =============================
  const [activeFilter, setActiveFilter] = useState('All');

  const maxCalls = useMemo(
    () => Math.max(...hourlyData.map((d) => d.total || d.connected + d.other)),
    [hourlyData],
  );

  const filteredCalls = useMemo(() => {
    if (activeFilter === 'All') return calls;
    if (activeFilter === 'Inbound')
      return calls.filter((c) => c.type === 'connected' || c.type === 'voicemail');
    if (activeFilter === 'Outbound') return calls.filter((c) => c.type === 'connected');
    return calls;
  }, [activeFilter, calls]);

  const getStatusIcon = (type) => {
    const icons = { connected: FiPhone, voicemail: FiVoicemail, missed: FiPhoneOff };
    return icons[type] || FiPhone;
  };

  const getStatusColor = (type) => {
    const colors = { connected: 'bg-green-500', voicemail: 'bg-yellow-500', missed: 'bg-red-500' };
    return colors[type] || 'bg-gray-500';
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">Call Activity</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of call performance and communication metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {callStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
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
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
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

      {/* Bottom Grid: Hourly Activity (left) + Recent Calls (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Call Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <FiCalendar size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hourly Call Activity</h3>
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
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center gap-4"
                >
                  {/* Hour Label */}
                  <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">{data.hour}</div>

                  {/* Bars */}
                  <div className="flex-1">
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      {/* Connected (Green) */}
                      <div
                        className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${connectedPercentage}%` }}
                      >
                        {data.connected > 0 && data.connected}
                      </div>
                      {/* Other (Blue) */}
                      <div
                        className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${otherPercentage}%` }}
                      >
                        {data.other > 0 && data.other}
                      </div>
                    </div>
                  </div>

                  {/* Connected Count */}
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400 text-right">{data.connected} connected</div>
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

        {/* Recent Calls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Calls</h3>
            <div className="flex gap-2">
              {['All', 'Inbound', 'Outbound'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            <AnimatePresence initial={false}>
              {filteredCalls.map((call, index) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 ${
                    index !== filteredCalls.length - 1
                      ? 'border-b border-gray-200 dark:border-gray-700'
                      : ''
                  }`}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg ${getStatusColor(call.type)} flex items-center justify-center`}>
                      {React.createElement(getStatusIcon(call.type), { size: 18, className: 'text-white' })}
                    </div>
                  </div>

                  {/* Caller info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{call.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{call.phone}</p>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiUser size={12} />
                      <span>{call.agent}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock size={12} />
                      <span>{call.duration}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.type === 'connected'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : call.type === 'voicemail'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {call.status}
                    </span>
                    <span>{call.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredCalls.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No calls found</div>
                <div className="text-gray-500 text-sm">Try adjusting your filter or check back later.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
