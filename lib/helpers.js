// Helper functions for text simplification

/**
 * Formats the simplification level label based on the slider value
 * @param {number} level - The simplification level (0-100)
 * @returns {string} The formatted label
 */
export function getSimplificationLevelLabel(level) {
  if (level < 33) {
    return "Basic"
  } else if (level < 66) {
    return "Standard"
  } else {
    return "Advanced"
  }
}

/**
 * Calculates the estimated reading time for a text
 * @param {string} text - The text to analyze
 * @returns {number} Estimated reading time in minutes
 */
export function calculateReadingTime(text) {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Counts characters, words, and sentences in a text
 * @param {string} text - The text to analyze
 * @returns {Object} Object containing counts
 */
export function getTextStats(text) {
  if (!text || text.trim() === "") {
    return { characters: 0, words: 0, sentences: 0 }
  }

  const characters = text.length
  const words = text.trim().split(/\s+/).length
  const sentences = text.split(/[.!?]+/).filter(Boolean).length

  return { characters, words, sentences }
}

