// Export all Notion API functions
export * from './client'
export * from './posts'
export * from './authors'
export * from './categories'
export * from './transforms'

// Re-export commonly used functions with simpler names
export { 
  getPublishedPosts as getPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostContent,
  searchPosts 
} from './posts'

export {
  getAllAuthors as getAuthors,
  getAuthorBySlug,
  getAuthorById
} from './authors'

export {
  getAllCategories as getCategories,
  getCategoryBySlug,
  getDefaultCategories
} from './categories'

export {
  transformNotionPost,
  transformNotionAuthor,
  transformNotionCategory,
  transformBlocksToHtml,
  transformBlocksToMarkdown
} from './transforms'