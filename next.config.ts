import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@solana/web3.js', '@coral-xyz/anchor']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    
    return config
  },
  transpilePackages: ['@solana/web3.js', '@coral-xyz/anchor'],
}

export default nextConfig
