// ========================================
// 🎯 RECENT CALLS COMPONENT
// ========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone,
  FiPhoneOff,
  FiVoicemail,
  FiUser,
  FiClock,
} from 'react-icons/fi';

const RecentCalls = () => {
  const [activeFilter, setActiveFilter] = useState('All');

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

  const getStatusIcon = (type) => {
    const icons = {
      connected: FiPhone,
      voicemail: FiVoicemail,
      missed: FiPhoneOff,
    };
    return icons[type] || FiPhone;
  };

  const getStatusColor = (type) => {
    const colors = {
      connected: 'bg-green-500',
      voicemail: 'bg-yellow-500',
      missed: 'bg-red-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const filteredCalls = activeFilter === 'All'
    ? calls
    : calls.filter(call => {
        if (activeFilter === 'Inbound') return call.type === 'connected' || call.type === 'voicemail';
        if (activeFilter === 'Outbound') return call.type === 'connected';
        return true;
      });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Recent Calls
          </h3>

          {/* Filter Buttons */}
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

        {/* Call List */}
        <div className="space-y-0">
          <AnimatePresence>
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
                    {React.createElement(getStatusIcon(call.type), {
                      size: 18,
                      className: 'text-white',
                    })}
                  </div>
                </div>

                {/* Caller Information */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {call.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {call.phone}
                  </p>
                </div>

                {/* Call Details */}
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  {/* Agent */}
                  <div className="flex items-center gap-1">
                    <FiUser size={12} />
                    <span>{call.agent}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1">
                    <FiClock size={12} />
                    <span>{call.duration}</span>
                  </div>

                  {/* Status */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    call.type === 'connected'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : call.type === 'voicemail'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {call.status}
                  </span>

                  {/* Time */}
                  <span>{call.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
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
};

export default RecentCalls;
