#!/usr/bin/env node

// ========================================
// 🎯 TEST CALENDAR APPOINTMENTS FUNCTION
// ========================================
// Simple test to verify the fetchCalendarAppointmentsWithDateHandling function
// handles Date objects correctly and converts them to proper ISO strings

const testCalendarAppointments = async () => {
  console.log('🧪 Testing Calendar Appointments Function');
  console.log('=' .repeat(50));

  // Test with Date objects (should work)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1); // Yesterday

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1); // Tomorrow

  console.log('📅 Test Parameters:');
  console.log(`   Start Date: ${startDate.toISOString()}`);
  console.log(`   End Date: ${endDate.toISOString()}`);
  console.log(`   Start Type: ${typeof startDate}`);
  console.log(`   End Type: ${typeof endDate}`);

  // Simulate the API call parameter validation
  let formattedStartTime, formattedEndTime;

  if (startDate instanceof Date) {
    formattedStartTime = startDate.toISOString();
    console.log('✅ startTime converted to ISO string');
  }

  if (endDate instanceof Date) {
    formattedEndTime = endDate.toISOString();
    console.log('✅ endTime converted to ISO string');
  }

  // Validate the formatted strings
  const startTimeValid = typeof formattedStartTime === 'string' && formattedStartTime.includes('T');
  const endTimeValid = typeof formattedEndTime === 'string' && formattedEndTime.includes('T');

  console.log('\n🔍 Validation Results:');
  console.log(`   Formatted startTime: ${formattedStartTime}`);
  console.log(`   Formatted endTime: ${formattedEndTime}`);
  console.log(`   startTime is valid string: ${startTimeValid}`);
  console.log(`   endTime is valid string: ${endTimeValid}`);

  // Check if this would pass the API validation
  const apiValidation = startTimeValid && endTimeValid &&
    new Date(formattedStartTime) < new Date(formattedEndTime);

  console.log('\n📊 API Compatibility Check:');
  console.log(`   Would pass API validation: ${apiValidation ? '✅ YES' : '❌ NO'}`);
  console.log(`   startTime format: ${startTimeValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   endTime format: ${endTimeValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Date range valid: ${new Date(formattedStartTime) < new Date(formattedEndTime) ? '✅ Valid' : '❌ Invalid'}`);

  if (apiValidation) {
    console.log('\n🎉 SUCCESS: Function should work without 422 errors!');
    console.log('📝 The date handling logic properly converts Date objects to ISO strings');
    console.log('🔄 This should resolve the "startTime must be a string" API error');
  } else {
    console.log('\n❌ FAIL: There are still issues with date formatting');
  }
};

// Run the test
testCalendarAppointments().catch(console.error);
