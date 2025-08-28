#!/usr/bin/env node

/**
 * 🧪 Test Dropdown Fix
 * Validates that the appointment modal dropdown logic now works correctly
 */

import { convertSlotsToTimeSlots } from './apps/dashboard/src/shared/utils/freeSlotsUtils.js';

console.log('🧪 Testing Dropdown Fix...\n');

// Mock API response (similar to what we see in the browser console)
const mockAPISlots = [
  { slot: "2025-08-27T08:00:00-07:00" },
  { slot: "2025-08-27T08:30:00-07:00" },
  { slot: "2025-08-27T09:00:00-07:00" },
  { slot: "2025-08-27T09:30:00-07:00" },
  { slot: "2025-08-27T10:00:00-07:00" },
  { slot: "2025-08-27T10:30:00-07:00" },
  { slot: "2025-08-27T11:00:00-07:00" },
  { slot: "2025-08-27T11:30:00-07:00" },
  { slot: "2025-08-27T13:00:00-07:00" },
  { slot: "2025-08-27T13:30:00-07:00" },
  { slot: "2025-08-27T14:00:00-07:00" },
  { slot: "2025-08-27T14:30:00-07:00" },
  { slot: "2025-08-27T15:00:00-07:00" },
  { slot: "2025-08-27T15:30:00-07:00" },
  { slot: "2025-08-27T16:00:00-07:00" },
  { slot: "2025-08-27T16:30:00-07:00" }
];

// Test the conversion that happens in getAvailableTimeSlots()
console.log('📅 Testing slot conversion...');
console.log('Input slots:', mockAPISlots.length);

const convertedSlots = convertSlotsToTimeSlots(mockAPISlots, 'America/Los_Angeles');

console.log('✅ Conversion Results:');
console.log('- Input count:', mockAPISlots.length);
console.log('- Output count:', convertedSlots.length);
console.log('- First 5 converted slots:');
convertedSlots.slice(0, 5).forEach((slot, i) => {
  console.log(`  ${i + 1}. ${slot}`);
});

// Test the dropdown logic conditions
console.log('\n🎯 Testing Dropdown Logic:');
const isLoadingSlots = false;
const slotsError = null;
const availableSlots = mockAPISlots;
const ghlTimezone = 'America/Los_Angeles';

// Simulate getAvailableTimeSlots function
function getAvailableTimeSlots() {
  if (availableSlots.length > 0) return convertSlotsToTimeSlots(availableSlots, ghlTimezone);
  return []; // fallback
}

const testConvertedSlots = getAvailableTimeSlots();

console.log('Dropdown Logic Test:');
console.log('- isLoadingSlots:', isLoadingSlots);
console.log('- slotsError:', slotsError);
console.log('- availableSlots.length:', availableSlots.length);
console.log('- convertedSlots.length:', testConvertedSlots.length);

// Test the new dropdown logic
if (isLoadingSlots) {
  console.log('🔄 Dropdown would show: "Loading available slots…"');
} else if (slotsError) {
  console.log('⚠️ Dropdown would show: "Using default times"');
} else if (testConvertedSlots.length > 0) {
  console.log('✅ Dropdown would show: "Select an available time slot (' + testConvertedSlots.length + ' available)"');
  console.log('✅ Options available:', testConvertedSlots.length);
  console.log('✅ First 3 options:');
  testConvertedSlots.slice(0, 3).forEach((slot, i) => {
    console.log(`   - ${slot}`);
  });
} else {
  console.log('❌ Dropdown would show: "No slots available for this date"');
}

console.log('\n🎉 Test Results:');
if (testConvertedSlots.length > 0) {
  console.log('✅ PASS: Dropdown should now show available slots correctly!');
  console.log('✅ The fix should resolve the issue where dropdown showed "No slots available"');
} else {
  console.log('❌ FAIL: There might still be an issue with slot conversion');
}

console.log('\n📱 Next Steps:');
console.log('1. Open http://localhost:5173 in your browser');
console.log('2. Click "Book Appointment" button');
console.log('3. Select calendar: cF0lnbb4A2vCVdKQLrJp');
console.log('4. Choose date: 2025-08-27');
console.log('5. Check that the time slot dropdown shows available times instead of "No slots available"');
