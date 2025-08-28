/**
 * Test timezone formatting to ensure clean display like GHL backend
 */

// Test data - simulating what might come from GHL API
const testTimezones = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  // Malformed examples that might come from GHL
  'GMT+01:59.996316666666665 America/Cayenne',
  'GMT-08:00 America/Los_Angeles (PDT)',
  'America/Chicago',
];

/**
 * Format timezone for display like GHL backend
 */
function formatTimezoneForDropdown(timezone) {
  try {
    // Clean and validate timezone string first
    let cleanTimezone = timezone.trim();

    // Check if timezone is already formatted or has weird formatting
    if (cleanTimezone.includes('GMT') && cleanTimezone.includes('.')) {
      // Extract clean timezone from malformed string like "GMT+01:59.996316666666665 America/Cayenne"
      const match = cleanTimezone.match(/([A-Za-z]+\/[A-Za-z_]+)/);
      if (match) {
        cleanTimezone = match[1];
      } else {
        // If no clean timezone found, try to extract from the string
        const fallbackMatch = cleanTimezone.match(/([A-Za-z_]+\/[A-Za-z_]+)/);
        cleanTimezone = fallbackMatch ? fallbackMatch[1] : 'America/Los_Angeles';
      }
    }

    // Validate timezone before processing
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: cleanTimezone });
    } catch (_error) {
      console.warn('⚠️ Invalid timezone detected:', cleanTimezone, 'using fallback');
      cleanTimezone = 'America/Los_Angeles';
    }

    const now = new Date();

    // Use Intl.DateTimeFormat to get the offset directly
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: cleanTimezone,
      timeZoneName: 'longOffset',
    });

    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    let offsetStr = 'GMT+00:00';

    if (offsetPart && offsetPart.value.includes('GMT')) {
      offsetStr = offsetPart.value;
    }

    // Get timezone abbreviation
    const abbreviationFormatter = new Intl.DateTimeFormat('en', {
      timeZone: cleanTimezone,
      timeZoneName: 'short',
    });

    const abbrevParts = abbreviationFormatter.formatToParts(now);
    const abbreviation = abbrevParts.find(part => part.type === 'timeZoneName')?.value || '';

    // Format like GHL: "GMT-08:00 America/Los_Angeles (PDT)"
    return `${offsetStr} ${cleanTimezone}${abbreviation ? ` (${abbreviation})` : ''}`;
  } catch (_error) {
    return timezone;
  }
}

// Test the formatting
console.log('🧪 Testing timezone formatting...\n');

testTimezones.forEach(tz => {
  const formatted = formatTimezoneForDropdown(tz);
  console.log(`Input:  ${tz}`);
  console.log(`Output: ${formatted}`);
  console.log('---');
});

console.log('✅ Timezone formatting test complete!');
