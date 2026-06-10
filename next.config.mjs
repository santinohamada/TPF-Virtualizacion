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
  assetPrefix: 'https://tpf-virtualizacion.vercel.app',
}

export default nextConfig;