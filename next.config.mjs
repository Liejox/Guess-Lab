/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  serverExternalPackages: [],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@keyv/redis': false,
        '@keyv/mongo': false,
        '@keyv/sqlite': false,
        '@keyv/postgres': false,
        '@keyv/mysql': false,
        '@keyv/etcd': false,
        '@keyv/offline': false,
        '@keyv/tiered': false,
      }
    }
    return config
  },
}

export default nextConfig
