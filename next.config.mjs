/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = {
        ...config.externals,
        'pg-native': 'commonjs pg-native', // Exclude pg-native from server bundle
      };
    }
    // Handle mapbox-gl for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  env: {
    NEXT_PUBLIC_AZURE_AD_CLIENT_ID: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
    NEXT_PUBLIC_AZURE_AD_TENANT_NAME: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_NAME,
    NEXT_PUBLIC_AZURE_AD_POLICY_NAME: process.env.NEXT_PUBLIC_AZURE_AD_POLICY_NAME,
    NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI,
  }
}

export default nextConfig
