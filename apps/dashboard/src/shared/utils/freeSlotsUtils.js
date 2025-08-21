// ========================================
// 🔧 FREE SLOTS UTILITY FUNCTIONS
// ========================================
// Reusable utility functions for free slot operations
// Keeps the main components clean and modular
// ========================================

import { createLogger } from '@utils/logger';

const utils = createLogger('FreeSlotsUtils');

/**
 * 🔧 Generate mock time slots for fallback when API fails or calendar has no availability
 * Creates realistic time slots in the specified timezone
 *
 * @param {string|Date} date - Date to generate slots for
 * @param {string} [timezone] - Timezone to use (optional)
 * @param {number} [slotDuration] - Duration of each slot in minutes (default: 30)
 * @param {number} [startHour] - Start hour (default: 9)
 * @param {number} [endHour] - End hour (default: 17)
 * @returns {Array} - Array of mock slot objects
 */
export function generateMockSlots(date, timezone = 'America/Los_Angeles', slotDuration = 30, startHour = 9, endHour = 17) {
  const selectedDate = new Date(date);
  const slots = [];

  utils.info('Generating mock slots', {
    date: selectedDate.toISOString().split('T')[0],
    timezone,
    slotDuration,
    startHour,
    endHour,
  });

  // Generate slots from startHour to endHour, every slotDuration minutes
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + slotDuration);

      slots.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        available: true,
        isMockSlot: true,
        timezone: timezone,
        displayTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        duration: slotDuration,
        source: 'mock_generator',
      });
    }
  }

  utils.success('Mock slots generated', {
    count: slots.length,
    timeRange: `${startHour}:00 - ${endHour}:00`,
    timezone,
  });

  return slots;
}

/**
 * 🔧 Convert GHL API slots to time slot format for dropdown display
 * Handles various response formats from the GHL API
 *
 * @param {Array} slots - Array of slot objects from GHL API
 * @param {string} [timezone] - Timezone for display formatting
 * @returns {Array} - Array of formatted time slot strings
 */
export function convertSlotsToTimeSlots(slots, timezone = null) {
  if (!slots || !Array.isArray(slots)) {
    utils.warn('Invalid slots array provided to converter', { slots });
    return [];
  }

  utils.info('Converting API slots to time slots format', {
    inputCount: slots.length,
    timezone,
    firstSlot: slots[0],
    slotStructure: slots[0] ? Object.keys(slots[0]) : 'N/A',
  });

  const timeSlots = slots.map((slot, index) => {
    try {
      // Handle different slot formats from GHL API
      let startTime, endTime;

      console.warn('🔍 Processing slot:', { index, slot, type: typeof slot });

      if (typeof slot === 'string') {
        // If slot is already a string (like "2024-08-15T14:00:00"), treat as start time
        startTime = new Date(slot);
        // Assume 30-minute duration if not specified
        endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        console.warn('📅 String slot processed:', { slot, startTime: startTime.toISOString(), endTime: endTime.toISOString() });
      } else if (typeof slot === 'object' && slot !== null) {
        console.warn('🔍 Object slot keys:', Object.keys(slot));

        // Handle object format with startTime/endTime properties
        if (slot.startTime) {
          startTime = new Date(slot.startTime);
        } else if (slot.start) {
          startTime = new Date(slot.start);
        } else if (slot.time) {
          startTime = new Date(slot.time);
        } else {
          utils.warn('Slot object missing time field', { slot, index, keys: Object.keys(slot) });
          return null;
        }

        if (slot.endTime) {
          endTime = new Date(slot.endTime);
        } else if (slot.end) {
          endTime = new Date(slot.end);
        } else if (slot.duration) {
          // Calculate end time from duration (assume minutes)
          endTime = new Date(startTime.getTime() + (slot.duration * 60 * 1000));
        } else {
          // Default to 30 minutes if no end time or duration
          endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        }

        console.warn('📅 Object slot processed:', {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          originalStart: slot.startTime || slot.start || slot.time,
          originalEnd: slot.endTime || slot.end || slot.duration,
        });
      } else {
        utils.warn('Unsupported slot format', { slot, type: typeof slot, index });
        return null;
      }

      // Validate dates
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        utils.warn('Invalid date in slot', { slot, index, startTime, endTime });
        return null;
      }

      // Format time to match GHL backend exactly: "2:00 pm - 2:30 pm"
      const formatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };

      if (timezone) {
        formatOptions.timeZone = timezone;
      }

      const startFormatted = startTime.toLocaleTimeString('en-US', formatOptions);
      const endFormatted = endTime.toLocaleTimeString('en-US', formatOptions);

      // Convert to lowercase to match GHL format: "2:00 PM" -> "2:00 pm"
      const startLower = startFormatted.toLowerCase();
      const endLower = endFormatted.toLowerCase();

      // Return in exact GHL format: "2:00 pm - 2:30 pm"
      return `${startLower} - ${endLower}`;

    } catch (error) {
      utils.warn('Error formatting slot', { slot, error: error.message, index });
      return null;
    }
  }).filter(Boolean); // Remove any null values

  utils.success('Slots converted successfully', {
    inputCount: slots.length,
    outputCount: timeSlots.length,
    sampleOutput: timeSlots.slice(0, 3),
  });

  return timeSlots;
}

/**
 * 🔧 Validate calendar ID format
 * Ensures calendar ID meets basic GHL format requirements
 *
 * @param {string} calendarId - Calendar ID to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export function validateCalendarId(calendarId) {
  if (!calendarId) {
    return {
      isValid: false,
      message: 'Calendar ID is required',
    };
  }

  if (typeof calendarId !== 'string') {
    return {
      isValid: false,
      message: 'Calendar ID must be a string',
    };
  }

  // Check for obvious invalid patterns
  if (calendarId.includes(' ')) {
    return {
      isValid: false,
      message: 'Calendar ID cannot contain spaces',
    };
  }

  if (calendarId.length < 10) {
    return {
      isValid: false,
      message: 'Calendar ID is too short (minimum 10 characters)',
    };
  }

  if (calendarId.length > 50) {
    return {
      isValid: false,
      message: 'Calendar ID is too long (maximum 50 characters)',
    };
  }

  // Check for basic alphanumeric format (GHL typically uses alphanumeric IDs)
  if (!/^[a-zA-Z0-9]+$/.test(calendarId)) {
    return {
      isValid: false,
      message: 'Calendar ID should only contain letters and numbers',
    };
  }

  return {
    isValid: true,
    message: 'Calendar ID is valid',
  };
}

/**
 * 🔧 Debounce function for API calls
 * Prevents excessive API calls when users rapidly change selections
 *
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 🔧 Create error message for free slots failures
 * Provides user-friendly error messages based on error types
 *
 * @param {Error} error - The error object
 * @param {string} _calendarId - Calendar ID that caused the error (unused but kept for API consistency)
 * @returns {string} - User-friendly error message
 */
export function createFreeSlotsErrorMessage(error, _calendarId) {
  const errorMessage = error.message || 'Unknown error';

  if (errorMessage.includes('Calendar not found')) {
    return 'The selected calendar could not be found. Please select a different calendar.';
  } else if (errorMessage.includes('configuration error')) {
    return 'This calendar needs to be configured in GHL. Please set up working hours and availability.';
  } else if (errorMessage.includes('Authentication error')) {
    return 'Authentication failed. Please check your GHL API configuration.';
  } else if (errorMessage.includes('Rate limit exceeded')) {
    return 'Too many requests. Please wait a moment before trying again.';
  } else if (errorMessage.includes('Permission error')) {
    return 'Access denied. Please check your GHL API permissions.';
  } else if (errorMessage.includes('Network')) {
    return 'Connection error. Please check your internet connection and try again.';
  } else {
    return `Unable to load time slots: ${errorMessage}. Using default time slots instead.`;
  }
}

/**
 * 🔧 Check if slots should be refreshed
 * Determines if slots need to be fetched based on current state
 *
 * @param {Object} params - Parameters to check
 * @param {string} params.calendarId - Current calendar ID
 * @param {string} params.date - Current date
 * @param {string} [params.userId] - Current user ID
 * @param {string} [params.lastCalendarId] - Previous calendar ID
 * @param {string} [params.lastDate] - Previous date
 * @param {string} [params.lastUserId] - Previous user ID
 * @returns {boolean} - Whether slots should be refreshed
 */
export function shouldRefreshSlots({
  calendarId,
  date,
  userId = null,
  lastCalendarId = null,
  lastDate = null,
  lastUserId = null,
}) {
  // Always refresh if calendar changed
  if (calendarId !== lastCalendarId) {
    utils.info('Slots refresh needed: calendar changed', {
      from: lastCalendarId,
      to: calendarId,
    });
    return true;
  }

  // Always refresh if date changed
  if (date !== lastDate) {
    utils.info('Slots refresh needed: date changed', {
      from: lastDate,
      to: date,
    });
    return true;
  }

  // Refresh if user changed (affects availability)
  if (userId !== lastUserId) {
    utils.info('Slots refresh needed: user changed', {
      from: lastUserId,
      to: userId,
    });
    return true;
  }

  // No refresh needed
  return false;
}

export default {
  generateMockSlots,
  convertSlotsToTimeSlots,
  validateCalendarId,
  debounce,
  createFreeSlotsErrorMessage,
  shouldRefreshSlots,
};
