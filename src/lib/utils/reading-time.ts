/**
 * Calculate reading time based on word count
 * Assumes average reading speed of 200 words per minute for Portuguese
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)
  
  return Math.max(1, readingTime) // Minimum 1 minute
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min de leitura'
  }
  
  return `${minutes} min de leitura`
}

/**
 * Extract text content from HTML or rich text
 */
export function extractTextContent(html: string): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  const textArea = typeof document !== 'undefined' 
    ? document.createElement('textarea')
    : null
    
  if (textArea) {
    textArea.innerHTML = text
    return textArea.value
  }
  
  // Basic HTML entity decoding for server-side
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}