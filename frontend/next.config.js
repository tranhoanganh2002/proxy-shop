/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_ZALO_SUPPORT_LINK: process.env.NEXT_PUBLIC_ZALO_SUPPORT_LINK || 'https://zalo.me/your-zalo-id',
  },
}

module.exports = nextConfig
