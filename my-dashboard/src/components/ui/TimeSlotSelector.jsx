// 🕐 Time Slot Selector Component
// Handles time slot selection for appointments

import { useState } from 'react';
import { FiClock, FiCalendar } from 'react-icons/fi';

const TimeSlotSelector = ({ 
  selectedSlot, 
  onSlotChange, 
  selectedDate, 
  onDateChange,
  selectedTimezone,
  onTimezoneChange,
  disabled = false 
}) => {
  const [showCustomTime, setShowCustomTime] = useState(false);

  // Time slots for different durations
  const timeSlots = {
    '30min': [
      '8:00 am - 8:30 am',
      '8:30 am - 9:00 am',
      '9:00 am - 9:30 am',
      '9:30 am - 10:00 am',
      '10:00 am - 10:30 am',
      '10:30 am - 11:00 am',
      '11:00 am - 11:30 am',
      '11:30 am - 12:00 pm',
      '1:00 pm - 1:30 pm',
      '1:30 pm - 2:00 pm',
      '2:00 pm - 2:30 pm',
      '2:30 pm - 3:00 pm',
      '3:00 pm - 3:30 pm',
      '3:30 pm - 4:00 pm',
      '4:00 pm - 4:30 pm',
      '4:30 pm - 5:00 pm',
    ],
    '60min': [
      '8:00 am - 9:00 am',
      '9:00 am - 10:00 am',
      '10:00 am - 11:00 am',
      '11:00 am - 12:00 pm',
      '1:00 pm - 2:00 pm',
      '2:00 pm - 3:00 pm',
      '3:00 pm - 4:00 pm',
      '4:00 pm - 5:00 pm',
    ],
  };

  const timezones = [
    'GMT-08:00 America/Los_Angeles (PST)',
    'GMT-07:00 America/Los_Angeles (PDT)',
    'GMT-06:00 America/Chicago (CST)',
    'GMT-05:00 America/New_York (EST)',
    'GMT+00:00 Europe/London (GMT)',
    'GMT+01:00 Europe/Paris (CET)',
    'GMT+05:30 Asia/Kolkata (IST)',
    'GMT+08:00 Asia/Shanghai (CST)',
    'GMT+09:00 Asia/Tokyo (JST)',
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiCalendar className="inline w-4 h-4 mr-2" />
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {selectedDate && (
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(selectedDate)}
          </p>
        )}
      </div>

      {/* Timezone Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timezone
        </label>
        <select
          value={selectedTimezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiClock className="inline w-4 h-4 mr-2" />
          Time Slot
        </label>
        
        {/* Duration Toggle */}
        <div className="flex space-x-2 mb-3">
          <button
            type="button"
            onClick={() => setShowCustomTime(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !showCustomTime
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={disabled}
          >
            Preset Slots
          </button>
          <button
            type="button"
            onClick={() => setShowCustomTime(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showCustomTime
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={disabled}
          >
            Custom Time
          </button>
        </div>

        {!showCustomTime ? (
          /* Preset Time Slots */
          <div className="space-y-3">
            {/* 30-minute slots */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">30-Minute Slots</h4>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots['30min'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSlotChange(slot)}
                    disabled={disabled}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      selectedSlot === slot
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 60-minute slots */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">60-Minute Slots</h4>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots['60min'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSlotChange(slot)}
                    disabled={disabled}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      selectedSlot === slot
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Custom Time Input */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={selectedSlot.split(' - ')[0] || ''}
                  onChange={(e) => {
                    const startTime = e.target.value;
                    const endTime = selectedSlot.split(' - ')[1] || '';
                    onSlotChange(`${startTime} - ${endTime}`);
                  }}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={selectedSlot.split(' - ')[1] || ''}
                  onChange={(e) => {
                    const startTime = selectedSlot.split(' - ')[0] || '';
                    const endTime = e.target.value;
                    onSlotChange(`${startTime} - ${endTime}`);
                  }}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector; 