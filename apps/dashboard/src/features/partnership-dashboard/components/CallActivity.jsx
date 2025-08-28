// ========================================
// 📊 CALL DASHBOARD (KPI grid + Recent Calls)
// - Layout matches reference: 2x2 KPI cards on the left, Recent Calls list on the right
// - Hourly Call Activity REMOVED
// - TailwindCSS + Framer Motion + react-icons
// ========================================

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone,
  FiPhoneCall,
  FiVoicemail,
  FiClock,
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

      {/* Two-column layout: KPI grid (left) + Recent Calls (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Cards - 2x2 grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {callStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700"
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
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.changeType === 'rate' ? (
                  <span className="text-green-600 font-medium">{stat.change}</span>
                ) : stat.changeType === 'secondary' ? (
                  <span>{stat.change}</span>
                ) : null}{' '}
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
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

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence initial={false}>
              {filteredCalls.map((call, index) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 py-4"
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg ${getStatusColor(call.type)} flex items-center justify-center`}>
                      {React.createElement(getStatusIcon(call.type), { size: 18, className: 'text-white' })}
                    </div>
                  </div>

                  {/* Row content, laid out to match reference */}
                  <div className="flex-1 grid grid-cols-5 items-center gap-4">
                    {/* Caller / phone */}
                    <div className="col-span-2 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{call.agent}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{call.phone}</p>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <FiClock size={12} />
                      <span>{call.duration}</span>
                    </div>

                    {/* Status pill */}
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

                    {/* Time */}
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-right">{call.time}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCalls.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No calls found</div>
              <div className="text-gray-500 text-sm">Try adjusting your filter or check back later.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
