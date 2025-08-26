/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'www.notion.so', 
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static optimization for better performance
  trailingSlash: false,
  // Revalidation settings for ISR
  async rewrites() {
    return []
  },
}

module.exports = nextConfig