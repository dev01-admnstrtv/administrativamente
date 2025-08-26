/**
 * Format date for display in blog posts
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Format date for SEO and structured data
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toISOString()
}

/**
 * Get relative time (e.g., "2 dias atrás")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Hoje'
  } else if (diffInDays === 1) {
    return 'Ontem'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} mês${months > 1 ? 'es' : ''} atrás`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `${years} ano${years > 1 ? 's' : ''} atrás`
  }
}