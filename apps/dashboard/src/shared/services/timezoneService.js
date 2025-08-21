import { GHL_CONFIG } from '@config/ghlConfig';

const FALLBACK_TIMEZONE = 'America/Los_Angeles';

// Simple cache for timezone data
const timezoneCache = new Map();

// Debug: Log configuration on import
console.warn('🔧 TimezoneService - GHL_CONFIG:', {
  locationId: GHL_CONFIG?.locationId,
  token: GHL_CONFIG?.token ? '***' + GHL_CONFIG.token.slice(-8) : 'MISSING',
  hasConfig: !!GHL_CONFIG,
});

// Convert date to location time with proper formatting
export const convertToLocationTime = (utcDate, timezone = FALLBACK_TIMEZONE, format = 'datetime') => {
  try {
    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided for timezone conversion:', utcDate);
      return utcDate;
    }

    const options = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    if (format === 'date') {
      delete options.hour;
      delete options.minute;
      delete options.second;
      delete options.hour12;
    } else if (format === 'time') {
      delete options.year;
      delete options.month;
      delete options.day;
      options.hour12 = true;
    }

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);

  } catch (error) {
    console.error('Error converting date to location timezone:', error);
    return utcDate;
  }
};

// Fetch all available timezones from GHL API for a specific location
export const fetchGHLAllTimezones = async (locationId = null) => {
  try {
    // Use provided locationId or fallback to config
    const effectiveLocationId = locationId || GHL_CONFIG?.locationId;

    if (!effectiveLocationId) {
      console.error('❌ No locationId provided and no fallback in GHL_CONFIG');
      throw new Error('Location ID is required but not provided');
    }

    console.warn('🌍 Fetching all timezones for location:', effectiveLocationId);

    const cacheKey = `all-timezones-${effectiveLocationId}`;

    // Check cache first
    if (timezoneCache.has(cacheKey)) {
      return timezoneCache.get(cacheKey);
    }

    // Validate token
    if (!GHL_CONFIG?.token) {
      console.error('❌ No GHL token configured');
      throw new Error('GHL API token is required but not configured');
    }

    // Rate limiting delay to prevent 429 errors
    await new Promise(resolve => setTimeout(resolve, 500));

    const apiUrl = `https://services.leadconnectorhq.com/locations/${effectiveLocationId}/timezones`;
    console.warn('📡 Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${GHL_CONFIG.token}`,
        'Version': '2021-07-28',
      },
    });

    console.warn('📡 Response status:', response.status, response.statusText);

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait before trying again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch timezones: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Handle different response formats
    let allTimezones = [];

    if (result.timezones && Array.isArray(result.timezones)) {
      // If we get an array of timezones
      allTimezones = result.timezones;
    } else if (result.timezone) {
      // If we get a single timezone, wrap it in array
      allTimezones = [result.timezone];
    } else if (result.data && Array.isArray(result.data)) {
      // Alternative data structure
      allTimezones = result.data;
    } else {
      // Fallback to common timezones
      allTimezones = [
        'America/Los_Angeles',
        'America/Chicago',
        'America/New_York',
        'America/Denver',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Kolkata',
      ];
    }

    // Cache the result
    timezoneCache.set(cacheKey, allTimezones);

    console.warn('✅ All timezones fetched:', allTimezones);
    return allTimezones;

  } catch (error) {
    console.error('❌ Error fetching all timezones from GHL:', error.message);

    // Return fallback timezone list on error
    const fallbackTimezones = [
      'America/Los_Angeles',
      'America/Chicago',
      'America/New_York',
      'America/Denver',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
    ];

    const cacheKey = `all-timezones-${locationId}`;
    timezoneCache.set(cacheKey, fallbackTimezones);
    return fallbackTimezones;
  }
};

// Fetch timezone from GHL API for a specific location (single timezone)
export const fetchGHLTimezone = async (locationId, userId = null) => {
  try {
    const cacheKey = `${locationId}-${userId || 'default'}`;

    // Check cache first
    if (timezoneCache.has(cacheKey)) {
      return timezoneCache.get(cacheKey);
    }

    // Get all timezones first
    const allTimezones = await fetchGHLAllTimezones(locationId);

    // Return the first timezone or fallback
    const timezone = allTimezones && allTimezones.length > 0 ? allTimezones[0] : FALLBACK_TIMEZONE;

    // Cache the result
    timezoneCache.set(cacheKey, timezone);

    return timezone;

  } catch (error) {
    console.error('❌ Error fetching timezone from GHL:', error.message);

    // Return fallback timezone on error
    const fallback = FALLBACK_TIMEZONE;
    const cacheKey = `${locationId}-${userId || 'default'}`;
    timezoneCache.set(cacheKey, fallback);
    return fallback;
  }
};

// Get current timezone (fallback for compatibility)
export const getCurrentTimezone = () => {
  return FALLBACK_TIMEZONE;
};

// Get timezone information
export const getTimezoneInfo = (timezone = FALLBACK_TIMEZONE) => {
  return {
    timezone,
    displayTimezone: formatTimezoneForDisplay(timezone),
    isInitialized: true,
    locationId: GHL_CONFIG.locationId,
    fallbackTimezone: FALLBACK_TIMEZONE,
  };
};

// Initialize timezone service (for compatibility)
export const initializeTimezone = async (locationId) => {
  return await fetchGHLTimezone(locationId);
};

// Check if timezone is ready
export const isTimezoneReady = () => {
  return true; // Always ready with fallback
};

// Get formatted timezone options for dropdown
export const getTimezoneOptions = async (locationId = null) => {
  try {
    // Use provided locationId or fallback to config
    const effectiveLocationId = locationId || GHL_CONFIG?.locationId;
    console.warn('🎯 Getting timezone options for location:', effectiveLocationId);

    const allTimezones = await fetchGHLAllTimezones(effectiveLocationId);

    const options = allTimezones.map(timezone => ({
      value: timezone,
      label: formatTimezoneForDisplay(timezone),
    }));

    console.warn('✅ Timezone options generated:', options.length, 'options');
    return options;
  } catch (error) {
    console.error('❌ Error getting timezone options:', error.message);

    // Return fallback options
    const fallbackTimezones = [
      'America/Los_Angeles',
      'America/Chicago',
      'America/New_York',
      'America/Denver',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
    ];

    console.warn('⚠️ Using fallback timezone options');
    return fallbackTimezones.map(timezone => ({
      value: timezone,
      label: formatTimezoneForDisplay(timezone),
    }));
  }
};

// Enhanced format timezone for display with better formatting
export const formatTimezoneForDisplay = (timezone = FALLBACK_TIMEZONE) => {
  const timezoneMap = {
    'America/Los_Angeles': 'GMT-08:00 America/Los_Angeles (PST/PDT)',
    'America/New_York': 'GMT-05:00 America/New_York (EST/EDT)',
    'America/Chicago': 'GMT-06:00 America/Chicago (CST/CDT)',
    'America/Denver': 'GMT-07:00 America/Denver (MST/MDT)',
    'Europe/London': 'GMT+00:00 Europe/London (GMT)',
    'Europe/Paris': 'GMT+01:00 Europe/Paris (CET)',
    'Asia/Tokyo': 'GMT+09:00 Asia/Tokyo (JST)',
    'Asia/Shanghai': 'GMT+08:00 Asia/Shanghai (CST)',
    'Asia/Kolkata': 'GMT+05:30 Asia/Kolkata (IST)',
  };
  return timezoneMap[timezone] || timezone;
};
