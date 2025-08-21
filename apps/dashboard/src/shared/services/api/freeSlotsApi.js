// ========================================
// 🎯 UNIFIED FREE SLOTS API - CLEAN VERSION
// ========================================
// Single source of truth for GHL free slots functionality
// Based on official GHL API documentation for /calendars/{calendarId}/free-slots
//
// API Reference:
// - Response format: { "_dates_": {...}, "slots": [...] }
// - Date range limit: Maximum 31 days
// - Supported parameters: startDate, endDate, timezone, userId, userIds
// - Timestamp format: milliseconds (e.g., 1548898600000)
// ========================================

import { GHL_CONFIG } from '@config/ghlConfig';

/**
 * 🎯 Fetch free slots from GHL Calendar API
 * @param {Object} params - Parameters
 * @param {string} params.calendarId - Calendar ID (required)
 * @param {string|number|Date} params.startDate - Start date (required)
 * @param {string|number|Date} params.endDate - End date (required)
 * @param {string} [params.timeZone] - Timezone (optional, e.g., "America/Chihuahua")
 * @param {string} [params.userId] - User ID filter (optional)
 * @param {string[]} [params.userIds] - Multiple user IDs filter (optional)
 * @returns {Promise<Object>} - Standardized response
 */
export async function fetchFreeSlots({
  calendarId,
  startDate,
  endDate,
  timeZone = null,
  userId = null,
  userIds = null,
}) {
  // Validate required parameters
  if (!calendarId || !startDate || !endDate) {
    throw new Error('calendarId, startDate, and endDate are required');
  }

  if (typeof calendarId !== 'string' || calendarId.length < 5) {
    throw new Error(`Invalid calendar ID: ${calendarId} (too short)`);
  }

  try {
    // Convert dates to milliseconds (GHL API format)
    const startMs = normalizeDateToMs(startDate);
    const endMs = normalizeDateToMs(endDate);

    // Validate date range (GHL API limit: 31 days maximum)
    const daysDifference = (endMs - startMs) / (1000 * 60 * 60 * 24);
    if (daysDifference > 31) {
      throw new Error(`Date range too large: ${daysDifference.toFixed(1)} days. Maximum allowed: 31 days.`);
    }

    // Build API URL with proper query parameters per GHL documentation
    const params = new URLSearchParams();
    params.append('startDate', startMs.toString());
    params.append('endDate', endMs.toString());

    // Optional parameters (based on GHL API docs)
    if (timeZone) params.append('timezone', timeZone);
    if (userId) params.append('userId', userId);
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      userIds.forEach(id => params.append('userIds', id));
    }

    const apiUrl = `https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendarId)}/free-slots?${params.toString()}`;

    // Make API request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': GHL_CONFIG.version,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}`;

      try {
        const parsedError = JSON.parse(errorText);
        errorMessage = parsedError.message || parsedError.error || errorMessage;
      } catch (_e) {
        errorMessage = errorText || errorMessage;
      }

      // Enhanced error messages
      if (response.status === 401) {
        throw new Error('Authentication failed: Invalid or expired API token');
      } else if (response.status === 403) {
        throw new Error('Permission denied: Insufficient calendar access');
      } else if (response.status === 404) {
        throw new Error(`Calendar not found: ${calendarId}`);
      } else {
        throw new Error(`API Error: ${errorMessage}`);
      }
    }

    const data = await response.json();

    // Parse GHL response format based on official API documentation
    // Response structure: { "_dates_": {...}, "slots": [...] }
    let slots = [];
    let dates = {};

    console.warn('🔍 GHL API Raw Response:', {
      keys: Object.keys(data),
      hasSlots: !!data.slots,
      hasDates: !!data._dates_,
      sampleData: JSON.stringify(data).substring(0, 500),
      fullResponse: data,
    });

    // Handle the documented _dates_ object structure
    if (data._dates_ && typeof data._dates_ === 'object') {
      dates = data._dates_;

      // Extract slots from _dates_ object
      Object.keys(dates).forEach(dateKey => {
        const dayData = dates[dateKey];
        if (dayData && dayData.slots && Array.isArray(dayData.slots)) {
          // Add date information to each slot
          const dateSlotsWithInfo = dayData.slots.map(slot => ({
            ...slot,
            date: dateKey,
          }));
          slots.push(...dateSlotsWithInfo);
        }
      });
    }

    // Also check for direct slots array (fallback)
    if (data.slots && Array.isArray(data.slots)) {
      slots = [...slots, ...data.slots];
    }

    // Check for any date-like keys in the response (YYYY-MM-DD format)
    const dateKeys = Object.keys(data).filter(key =>
      key.match(/^\d{4}-\d{2}-\d{2}$/) || // Standard date format
      key.match(/^\d{8}$/), // Alternative format like 20240815
    );

    if (dateKeys.length > 0) {
      console.warn('🗓️ Found date keys:', dateKeys);
      dateKeys.forEach(dateKey => {
        const dayData = data[dateKey];
        if (dayData) {
          // Check if dayData has slots directly
          if (Array.isArray(dayData)) {
            slots.push(...dayData.map(slot => ({ ...slot, date: dateKey })));
          } else if (dayData.slots && Array.isArray(dayData.slots)) {
            const dateSpecificSlots = dayData.slots.map(slot => ({
              ...slot,
              date: dateKey,
            }));
            slots.push(...dateSpecificSlots);
          }
        }
      });
    }

    // Final fallback - check if data itself is an array
    if (Array.isArray(data) && data.length > 0) {
      console.warn('📋 Data is array, using directly');
      slots = data;
    }

    console.warn('🎯 Final parsed slots:', {
      totalSlots: slots.length,
      firstSlot: slots[0],
      slotTypes: slots.map(s => typeof s).slice(0, 3),
    });

    return {
      success: true,
      slots,
      dates, // Include the _dates_ object from the API response
      totalSlots: slots.length,
      dateRange: {
        start: new Date(startMs).toISOString(),
        end: new Date(endMs).toISOString(),
        days: Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)),
      },
      meta: {
        calendarId,
        timeZone,
        userId,
        userIds,
        startDate: startMs,
        endDate: endMs,
        requestTimestamp: new Date().toISOString(),
      },
      rawResponse: data,
    };

  } catch (error) {
    return {
      success: false,
      slots: [],
      dates: {},
      totalSlots: 0,
      error: error.message,
      meta: {
        calendarId,
        timeZone,
        userId,
        userIds,
        requestTimestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * 🎯 Convenience function to fetch free slots for a specific date
 * @param {string} calendarId - Calendar ID (required)
 * @param {Date|string} date - Date to fetch slots for (required)
 * @param {string} [timeZone] - Timezone (optional, e.g., "America/Chihuahua")
 * @param {string} [userId] - User ID to filter by (optional)
 * @returns {Promise<Object>} - Standardized free slots response
 */
export async function fetchFreeSlotsForDate(calendarId, date, timeZone = null, userId = null) {
  const selectedDate = new Date(date);

  // Validate date
  if (isNaN(selectedDate.getTime())) {
    throw new Error(`Invalid date provided: ${date}`);
  }

  // Use UTC dates to avoid timezone confusion
  // Create proper UTC timestamps for the requested date
  const year = selectedDate.getUTCFullYear();
  const month = selectedDate.getUTCMonth();
  const day = selectedDate.getUTCDate();

  // Set to beginning of day in UTC (00:00:00.000 UTC)
  const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).getTime();

  // Set to end of day in UTC (23:59:59.999 UTC)
  const endDate = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)).getTime();

  const response = await fetchFreeSlots({
    calendarId,
    startDate,
    endDate,
    timeZone,
    userId,
  });

  // For single-day requests, filter slots to only include the requested date
  if (response.success && response.slots.length > 0) {
    const requestedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // "2025-08-15"

    // Filter slots to only include ones that start with the requested date
    const daySlots = response.slots.filter(slot => {
      if (typeof slot === 'string') {
        return slot.startsWith(requestedDateStr);
      }
      return true; // Keep non-string slots as-is
    });

    return {
      ...response,
      slots: daySlots,
    };
  }

  return response;
}

/**
 * 🎯 Fetch free slots using broader date range (similar to working cURL approach)
 * @param {string} calendarId - Calendar ID (required)
 * @param {Date|string} centerDate - Center date for the range (required)
 * @param {number} [daysBefore=7] - Days before center date to include
 * @param {number} [daysAfter=7] - Days after center date to include
 * @param {string} [timeZone] - Timezone for metadata/logging only (NOT sent to API)
 * @param {string} [userId] - User ID to filter by (optional)
 * @returns {Promise<Object>} - Standardized free slots response
 */
export async function fetchFreeSlotsRange(calendarId, centerDate, daysBefore = 7, daysAfter = 7, timeZone = null, userId = null) {
  const center = new Date(centerDate);

  // Validate date
  if (isNaN(center.getTime())) {
    throw new Error(`Invalid center date provided: ${centerDate}`);
  }

  // Create broader date range in UTC
  const startDate = new Date(center.getTime() - (daysBefore * 24 * 60 * 60 * 1000));
  const endDate = new Date(center.getTime() + (daysAfter * 24 * 60 * 60 * 1000));

  return await fetchFreeSlots({
    calendarId,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    timeZone,
    userId,
  });
}

/**
 * 🔧 Helper function to normalize different date formats to milliseconds
 * @param {Date|string|number} date - Date in various formats
 * @returns {number} - Timestamp in milliseconds
 */
function normalizeDateToMs(date) {
  if (date instanceof Date) {
    return date.getTime();
  } else if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date string: ${date}`);
    }
    return parsedDate.getTime();
  } else if (typeof date === 'number') {
    // If it's a timestamp in seconds, convert to milliseconds
    return date < 10000000000 ? date * 1000 : date;
  } else {
    throw new Error(`Unsupported date format: ${typeof date}`);
  }
}

// Export the main function as default for backward compatibility
export default fetchFreeSlots;
