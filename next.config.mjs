/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Advanced configuration for deployment
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://chat.davidfrench.io'
  },

  // Webpack configuration for compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },

  // TypeScript and build optimizations
  typescript: {
    ignoreBuildErrors: false
  },

  // ESM support
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
};

export default nextConfig;