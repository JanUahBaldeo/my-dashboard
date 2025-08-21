// ========================================
// 🧹 CONTACT TAG CLEANER UTILITY
// ========================================

/**
 * Comprehensive tag cleaning function to remove:
 * - Random GHL API-generated tags
 * - Duplicate stage tags
 * - Malformed or suspicious tags
 */
export const cleanContactTags = (tags = [], targetStage = null) => {
  console.warn('🧹 CLEANING CONTACT TAGS:', { originalTags: tags, targetStage });

  if (!Array.isArray(tags)) {
    console.warn('⚠️ Invalid tags array, converting:', tags);
    tags = [];
  }

  // Valid stage names (case insensitive)
  const validStages = [
    'new lead', 'contacted', 'application started',
    'pre-approved', 'pre approved', 'in underwriting', 'closed',
  ];

  const cleanedTags = tags.filter(tag => {
    if (!tag || typeof tag !== 'string') return false;

    const lowerTag = tag.toLowerCase().trim();

    // Remove empty or whitespace-only tags
    if (lowerTag.length === 0) return false;

    // Remove stage tags (we'll add the target stage separately)
    if (validStages.includes(lowerTag)) return false;

    // Remove random API-generated tags
    if (tag.length > 15 && /^[a-z0-9]+$/i.test(tag)) {
      console.warn('🗑️ Removing random alphanumeric tag:', tag);
      return false;
    }

    // Remove API-related suspicious tags
    if (tag.includes('api') && tag.length > 8) {
      console.warn('🗑️ Removing API-related tag:', tag);
      return false;
    }

    // Remove long alphanumeric codes
    if (/^[0-9a-z]{8,}$/i.test(tag)) {
      console.warn('🗑️ Removing alphanumeric code:', tag);
      return false;
    }

    // Remove stage ID-like strings
    if (tag.includes('-') && tag.length > 20) {
      console.warn('🗑️ Removing stage ID-like tag:', tag);
      return false;
    }

    // Keep legitimate tags
    return true;
  });

  // Add the target stage tag if provided
  const finalTags = [...cleanedTags];
  if (targetStage) {
    finalTags.push(targetStage);
  }

  // Remove duplicates
  const uniqueTags = [...new Set(finalTags)];

  console.warn('🧹 TAG CLEANING RESULT:', {
    original: tags.length,
    afterCleaning: cleanedTags.length,
    final: uniqueTags.length,
    removed: tags.filter(tag => !uniqueTags.includes(tag)),
    kept: uniqueTags,
  });

  return uniqueTags;
};

// Test with the problematic tags from the screenshot
const testCleanup = () => {
  const problematicTags = [
    'loan from api',
    'kphmfuy6kyfbiimiqke',
    '09uumzj8btxwiluswi6o',
    'New Lead', // Valid stage tag - should be removed and replaced
    'Some Valid Tag', // Should be kept
  ];

  console.warn('🧪 TESTING TAG CLEANUP:');
  const result = cleanContactTags(problematicTags, 'Contacted');

  return result;
};

// Run the test
testCleanup();

export default cleanContactTags;
