/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },

  // Disable static page generation for API routes
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
}

module.exports = nextConfig
