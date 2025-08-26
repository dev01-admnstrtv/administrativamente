/**
 * Create URL-friendly slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Portuguese characters
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Generate unique slug by appending number if needed
 */
export function generateUniqueSlug(
  baseSlug: string, 
  existingSlugs: string[]
): string {
  let slug = createSlug(baseSlug)
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${createSlug(baseSlug)}-${counter}`
    counter++
  }
  
  return slug
}