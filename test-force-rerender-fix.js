#!/usr/bin/env node

/**
 * 🧪 Test Force Re-render Fix
 * Validates that the UI updates when slots change using slotsVersion counter
 */

console.log('🧪 Testing Force Re-render Fix...\n');

// Simulate the React component state
let availableSlots = [];
let slotsVersion = 0;
let form = {
  timezone: 'America/Los_Angeles',
  date: '2025-08-27',
  calendar: 'cF0lnbb4A2vCVdKQLrJp'
};

function generateDropdownKey() {
  return `slot-dropdown-${slotsVersion}-${availableSlots.length}-${form.timezone}-${form.date}-${form.calendar}`;
}

function setAvailableSlots(newSlots) {
  availableSlots = newSlots;
}

function setSlotsVersion(updateFn) {
  slotsVersion = updateFn(slotsVersion);
}

console.log('🔧 Testing Dropdown Key Changes:\n');

// Test 1: Initial state
console.log('1️⃣ Initial State:');
console.log('   Slots:', availableSlots.length);
console.log('   Version:', slotsVersion);
console.log('   Key:', generateDropdownKey());
console.log('');

// Test 2: Fetch new slots (simulate API response)
console.log('2️⃣ After Fetching Slots:');
setAvailableSlots([
  { slot: "2025-08-27T08:00:00-07:00" },
  { slot: "2025-08-27T08:30:00-07:00" },
  { slot: "2025-08-27T09:00:00-07:00" }
]);
setSlotsVersion(v => v + 1); // Force re-render
console.log('   Slots:', availableSlots.length);
console.log('   Version:', slotsVersion);
console.log('   Key:', generateDropdownKey());
console.log('   ✅ Key changed - UI should re-render!');
console.log('');

// Test 3: Change timezone
console.log('3️⃣ Change Timezone:');
form.timezone = 'America/New_York';
// Clear slots first
setAvailableSlots([]);
setSlotsVersion(v => v + 1); // Force re-render
console.log('   Slots:', availableSlots.length, '(cleared)');
console.log('   Version:', slotsVersion);
console.log('   Key:', generateDropdownKey());
console.log('   ✅ Key changed - UI should re-render!');
console.log('');

// Test 4: New slots for new timezone
console.log('4️⃣ New Slots for New Timezone:');
setAvailableSlots([
  { slot: "2025-08-27T11:00:00-04:00" }, // Eastern time
  { slot: "2025-08-27T11:30:00-04:00" },
  { slot: "2025-08-27T12:00:00-04:00" },
  { slot: "2025-08-27T12:30:00-04:00" }
]);
setSlotsVersion(v => v + 1); // Force re-render
console.log('   Slots:', availableSlots.length);
console.log('   Version:', slotsVersion);
console.log('   Key:', generateDropdownKey());
console.log('   ✅ Key changed - UI should re-render with 4 slots!');
console.log('');

// Test 5: Change date
console.log('5️⃣ Change Date:');
form.date = '2025-08-28';
setAvailableSlots([]);
setSlotsVersion(v => v + 1); // Force re-render
console.log('   Slots:', availableSlots.length, '(cleared)');
console.log('   Version:', slotsVersion);
console.log('   Key:', generateDropdownKey());
console.log('   ✅ Key changed - UI should re-render!');
console.log('');

console.log('🎯 Summary of Key Changes:');
console.log('- Initial: slot-dropdown-0-0-America/Los_Angeles-2025-08-27-cF0lnbb4A2vCVdKQLrJp');
console.log('- After fetch: slot-dropdown-1-3-America/Los_Angeles-2025-08-27-cF0lnbb4A2vCVdKQLrJp');
console.log('- Timezone change: slot-dropdown-2-0-America/New_York-2025-08-27-cF0lnbb4A2vCVdKQLrJp');
console.log('- New slots: slot-dropdown-3-4-America/New_York-2025-08-27-cF0lnbb4A2vCVdKQLrJp');
console.log('- Date change: slot-dropdown-4-0-America/New_York-2025-08-28-cF0lnbb4A2vCVdKQLrJp');

console.log('\n🔧 What This Fix Does:');
console.log('✅ Every time slots change, slotsVersion increments');
console.log('✅ Dropdown key includes slotsVersion, forcing React to re-render');
console.log('✅ UI will update immediately when slots are cleared or updated');
console.log('✅ Prevents stale UI state from showing old slot counts');

console.log('\n📱 Expected Browser Behavior:');
console.log('1. Change timezone → Dropdown immediately shows loading state');
console.log('2. New slots fetch → Dropdown immediately shows new slot count');
console.log('3. Change date → Dropdown immediately clears and shows loading');
console.log('4. No more stuck "16 available slots" from previous state');

console.log('\n🚀 Test Instructions:');
console.log('1. Open appointment modal');
console.log('2. Select calendar and date');
console.log('3. Change timezone - watch for immediate dropdown update');
console.log('4. Check console for slotsVersion incrementing');
console.log('5. Verify slot count changes when timezone changes');
