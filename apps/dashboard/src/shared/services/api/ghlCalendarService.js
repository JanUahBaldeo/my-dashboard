/**
 * GoHighLevel Calendar Events Service (clean JS)
 * - Removes console/loggers
 * - Deduplicates request/error logic
 * - Keeps robust validation and helpful messages
 */

//
// Internal helpers
//
let _configModule;

/** Lazy-load and cache GHL config */
async function getConfig() {
  if (!_configModule) {
    _configModule = await import('../../../config/ghlConfig.js');
  }
  const { GHL_CONFIG } = _configModule;
  if (!GHL_CONFIG || !GHL_CONFIG.token) {
    throw new Error('GHL API token is not configured.');
  }
  return GHL_CONFIG;
}

/** Build common headers */
function buildHeaders({ token, version, json = true }) {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    Version: version,
  };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

/** Parse an error payload safely */
async function parseError(response) {
  const base = `HTTP ${response.status}: ${response.statusText}`;
  try {
    const data = await response.clone().json();
    if (data && (data.message || data.error || data.errors)) {
      const detail = data.message || data.error || JSON.stringify(data.errors);
      return `${base} - ${detail}`;
    }
  } catch (_) {
    try {
      const text = await response.clone().text();
      if (text) return `${base} - ${text}`;
    } catch (_) {}
  }
  return base;
}

/** Fetch wrapper with unified error handling */
async function apiRequest(url, { method = 'GET', headers, body } = {}) {
  const res = await fetch(url, { method, headers, body });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/** Quick query-string builder */
function qs(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

//
// Public API
//

/**
 * Get calendar details
 * @param {string} calendarId
 * @returns {Promise<Object>}
 */
async function getCalendarDetails(calendarId) {
  if (!calendarId || typeof calendarId !== 'string') {
    throw new Error('calendarId is required and must be a string');
  }
  const cfg = await getConfig();
  const url = `${cfg.baseUrl || 'https://services.leadconnectorhq.com'}/calendars/${encodeURIComponent(calendarId)}`;
  return apiRequest(url, {
    headers: buildHeaders({ token: cfg.token, version: cfg.version, json: false }),
  });
}

/**
 * Get calendar events by ISO time range
 * @param {string} calendarId
 * @param {string} startTime ISO string
 * @param {string} endTime ISO string
 * @returns {Promise<Object>}
 */
async function getCalendarEvents(calendarId, startTime, endTime) {
  if (!calendarId || typeof calendarId !== 'string') {
    throw new Error('calendarId is required and must be a string');
  }
  if (!startTime || typeof startTime !== 'string') {
    throw new Error('startTime is required and must be an ISO string');
  }
  if (!endTime || typeof endTime !== 'string') {
    throw new Error('endTime is required and must be an ISO string');
  }

  const cfg = await getConfig();
  const base = cfg.baseUrl || 'https://services.leadconnectorhq.com';
  const url = `${base}/calendars/events?${qs({ calendarId, startTime, endTime })}`;

  return apiRequest(url, {
    headers: buildHeaders({ token: cfg.token, version: cfg.version, json: false }),
  });
}

/**
 * Get calendars list
 * @param {string} locationId
 * @param {string|null} groupId
 * @returns {Promise<Object>}
 */
async function getCalendarsList(locationId, groupId = null) {
  if (!locationId || typeof locationId !== 'string') {
    throw new Error('locationId is required and must be a string');
  }

  const cfg = await getConfig();
  const base = cfg.baseUrl || 'https://services.leadconnectorhq.com';
  const url = `${base}/calendars/?${qs({ locationId, groupId })}`;

  return apiRequest(url, {
    headers: buildHeaders({ token: cfg.token, version: cfg.version, json: false }),
  });
}

/**
 * Get calendar events (Unix ms timestamps)
 * @param {string} locationId
 * @param {string} calendarId
 * @param {number} startTime Unix ms
 * @param {number} endTime Unix ms
 * @returns {Promise<Object>}
 */
async function fetchGHLCalendarEvents(locationId, calendarId, startTime, endTime) {
  if (!locationId || typeof locationId !== 'string') {
    throw new Error('locationId is required and must be a string');
  }
  if (!calendarId || typeof calendarId !== 'string') {
    throw new Error('calendarId is required and must be a string');
  }
  if (typeof startTime !== 'number' || Number.isNaN(startTime)) {
    throw new Error('startTime must be a number (Unix timestamp in ms)');
  }
  if (typeof endTime !== 'number' || Number.isNaN(endTime)) {
    throw new Error('endTime must be a number (Unix timestamp in ms)');
  }

  const cfg = await getConfig();
  const base = cfg.baseUrl || 'https://services.leadconnectorhq.com';
  const url = `${base}/calendars/events?${qs({
    locationId,
    calendarId,
    startTime: String(startTime),
    endTime: String(endTime),
  })}`;

  return apiRequest(url, {
    headers: buildHeaders({ token: cfg.token, version: cfg.version, json: false }),
  });
}

/**
 * Convenience: get events by Date objects
 * @param {string} locationId
 * @param {string} calendarId
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<Object>}
 */
async function fetchGHLCalendarEventsByDateRange(locationId, calendarId, startDate, endDate) {
  if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
    throw new Error('startDate must be a valid Date');
  }
  if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
    throw new Error('endDate must be a valid Date');
  }
  return fetchGHLCalendarEvents(locationId, calendarId, startDate.getTime(), endDate.getTime());
}

/**
 * Create a blocked time slot
 * @param {Object} blockData
 * @param {string} blockData.title
 * @param {string} blockData.calendarId
 * @param {string} blockData.assignedUserId
 * @param {string} blockData.locationId
 * @param {string} blockData.startTime ISO
 * @param {string} blockData.endTime ISO
 * @returns {Promise<Object>}
 */
async function createBlockSlot(blockData) {
  const { title, calendarId, assignedUserId, locationId, startTime, endTime } = blockData || {};
  if (!title || typeof title !== 'string') throw new Error('title is required and must be a string');
  if (!calendarId || typeof calendarId !== 'string') throw new Error('calendarId is required and must be a string');
  if (!assignedUserId || typeof assignedUserId !== 'string') throw new Error('assignedUserId is required and must be a string');
  if (!locationId || typeof locationId !== 'string') throw new Error('locationId is required and must be a string');
  if (!startTime || !endTime) throw new Error('startTime and endTime are required');

  const cfg = await getConfig();
  const base = cfg.baseUrl || 'https://services.leadconnectorhq.com';
  const url = `${base}/calendars/events/block-slots`;

  return apiRequest(url, {
    method: 'POST',
    headers: buildHeaders({ token: cfg.token, version: cfg.version, json: true }),
    body: JSON.stringify({ title, calendarId, assignedUserId, locationId, startTime, endTime }),
  });
}

export {
  getCalendarEvents,
  getCalendarDetails,
  getCalendarsList,
  fetchGHLCalendarEvents,
  fetchGHLCalendarEventsByDateRange,
  createBlockSlot,
};
