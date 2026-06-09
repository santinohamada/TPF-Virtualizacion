/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  basePath: '/45275660',
  images: { unoptimized: true },
}

module.exports = nextConfig;