/**
 * Test Appointment & Event Management Functions
 */

import {
  createAppointment,
  updateAppointmentDetails,
  getAppointmentDetails,
  getAllCalendarEvents,
  getBlockedSlots,
  createBlockedSlot,
  updateBlockedSlot,
  deleteCalendarEvent,
  bulkCreateAppointments,
  bulkDeleteEvents,
} from '../src/shared/services/api/calendarApi.js';

// Test function structure
const functions = {
  createAppointment,
  updateAppointmentDetails,
  getAppointmentDetails,
  getAllCalendarEvents,
  getBlockedSlots,
  createBlockedSlot,
  updateBlockedSlot,
  deleteCalendarEvent,
  bulkCreateAppointments,
  bulkDeleteEvents,
};

console.warn('📋 Testing appointment & event management functions...');

let foundCount = 0;
Object.entries(functions).forEach(([name, func]) => {
  if (typeof func === 'function') {
    console.warn(`✅ ${name} - Function exists and is callable`);
    foundCount++;
  } else {
    console.error(`❌ ${name} - Not a function or not exported properly`);
  }
});

console.warn(`🎉 Test completed: ${foundCount}/${Object.keys(functions).length} functions found!`);
