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
  assetPrefix: 'https://tpf-virtualizacion.vercel.app/45275660',
  async headers() {
    return [
      {
        // Esto permite que el CDN de Vercel sirva las fuentes (woff2) sin error de CORS
        source: "/_next/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }
        ]
      }
    ]
  }
}

export default nextConfig;