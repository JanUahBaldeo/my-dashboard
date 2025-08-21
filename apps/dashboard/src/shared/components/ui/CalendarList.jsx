import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiCalendar,
  FiX,
  FiClock,
  FiUser,
  FiMapPin,
  FiTag,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

const CalendarList = ({
  isOpen,
  onClose,
  availableCalendars = [],
  selectedCalendars = new Set(),
  onCalendarSelection = () => {},
  isLoading = false,
  ghlEvents = {},
}) => {
  const [expandedCalendars, setExpandedCalendars] = useState(new Set());

  // Auto-expand selected calendars
  useEffect(() => {
    setExpandedCalendars(new Set(selectedCalendars));
  }, [selectedCalendars]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleCalendarSelect = useCallback(
    (calendar) => {
      const isSelected = selectedCalendars.has(calendar.id);
      onCalendarSelection(calendar.id, calendar.name, !isSelected);
    },
    [onCalendarSelection, selectedCalendars],
  );

  const toggleCalendarExpansion = useCallback((calendarId) => {
    setExpandedCalendars((prev) => {
      const next = new Set(prev);
      next.has(calendarId) ? next.delete(calendarId) : next.add(calendarId);
      return next;
    });
  }, []);

  const formatEventDate = (dateLike) => {
    const d = new Date(dateLike);
    if (Number.isNaN(d.getTime())) return { date: 'Invalid Date', time: 'Invalid Time' };
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  const getCalendarEvents = (calendarId) => {
    const arr = Array.isArray(ghlEvents?.[calendarId]) ? ghlEvents[calendarId] : [];
    // De-dup by (id || title + start)
    const seen = new Set();
    const out = [];
    for (const e of arr) {
      const key = `${e.id || e.appointmentId || e.title || 'evt'}::${e.startTime || e.start || ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(e);
    }
    return out;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="calendar-list-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="calendar-list-modal"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-list-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <FiCalendar className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="calendar-list-title" className="text-2xl font-bold text-gray-900">
                    Calendar List
                  </h2>
                  <p className="text-sm text-gray-600">Select calendars to view their scheduled items</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {isLoading && availableCalendars.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <p className="text-lg font-semibold text-gray-900">Loading calendars...</p>
                    <p className="text-sm text-gray-600">Fetching from GoHighLevel</p>
                  </div>
                </div>
              ) : availableCalendars.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FiCalendar className="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" />
                    <p className="text-lg font-semibold text-gray-900">No calendars found</p>
                    <p className="text-sm text-gray-600">Check your GHL configuration</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableCalendars.map((calendar) => {
                    const isSelected = selectedCalendars.has(calendar.id);
                    const isExpanded = expandedCalendars.has(calendar.id);
                    const events = isSelected && isExpanded ? getCalendarEvents(calendar.id) : [];

                    return (
                      <motion.div
                        key={calendar.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl border p-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-200 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Calendar Row */}
                        <div className="flex items-center gap-4">
                          <label className="flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCalendarSelect(calendar)}
                              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              aria-label={`Select ${calendar.name || 'calendar'}`}
                            />
                          </label>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {calendar.name || 'Unnamed Calendar'}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  calendar.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {calendar.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="text-gray-600">ID: {calendar.id}</span>
                              {Array.isArray(calendar.teamMembers) && (
                                <span className="text-gray-600">
                                  {calendar.teamMembers.length} team member
                                  {calendar.teamMembers.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <button
                              type="button"
                              onClick={() => toggleCalendarExpansion(calendar.id)}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-100"
                              aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              {isExpanded ? (
                                <FiChevronUp className="h-5 w-5" />
                              ) : (
                                <FiChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Events */}
                        <AnimatePresence initial={false}>
                          {isSelected && isExpanded && (
                            <motion.div
                              key={`${calendar.id}-events`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-4 overflow-hidden border-t border-gray-200 pt-4"
                            >
                              {events.length > 0 ? (
                                <div className="space-y-2">
                                  <h4 className="flex items-center gap-2 font-medium text-gray-900">
                                    <FiClock className="h-4 w-4" />
                                    Scheduled Items ({events.length})
                                  </h4>

                                  <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {events.map((event, idx) => {
                                      const when = formatEventDate(event.startTime || event.start);
                                      return (
                                        <div
                                          key={event.id || event.appointmentId || idx}
                                          className="rounded-lg border border-gray-100 bg-white p-3 transition-colors hover:border-blue-200"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <h5 className="mb-1 font-medium text-gray-900">
                                                {event.title || 'Untitled Event'}
                                              </h5>
                                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                  <FiClock className="h-3 w-3" />
                                                  {when.date} at {when.time}
                                                </span>
                                                {event.contactName ? (
                                                  <span className="inline-flex items-center gap-1">
                                                    <FiUser className="h-3 w-3" />
                                                    {event.contactName}
                                                  </span>
                                                ) : null}
                                                {event.location ? (
                                                  <span className="inline-flex items-center gap-1">
                                                    <FiMapPin className="h-3 w-3" />
                                                    {event.location}
                                                  </span>
                                                ) : null}
                                              </div>
                                            </div>

                                            {event.status ? (
                                              <span
                                                className={`mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                  event.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : event.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                              >
                                                <FiTag className="mr-1 h-3 w-3" />
                                                {event.status}
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 text-center">
                                  <FiCalendar className="mx-auto mb-2 h-8 w-8 text-gray-400" aria-hidden="true" />
                                  <p className="text-gray-600">No scheduled items found</p>
                                  <p className="text-sm text-gray-500">Events from last week to next month</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedCalendars.size} of {availableCalendars.length} calendars selected
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarList;
