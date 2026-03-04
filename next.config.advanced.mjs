import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core Configuration
  reactStrictMode: true,
  output: 'standalone',
  
  // Advanced Compilation Strategies
  compiler: {
    // Enable advanced optimizations
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: true,
  },

  // Comprehensive Module Resolution
  webpack: (config, { isServer, dev }) => {
    // Enhanced module resolution
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mtsx', '.mjs'],
    };

    // Advanced fallback configurations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }

    // Performance and optimization configurations
    if (!dev) {
      config.optimization.minimize = true;
    }

    return config;
  },

  // Environment and Build Optimizations
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://chat.davidfrench.io',
    NODE_OPTIONS: '--max_old_space_size=4096'
  },

  // TypeScript Strict Configurations
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  // Experimental Features
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'next-auth'],
    serverComponentsExternalPackages: [
      '@supabase/supabase-js',
      'next-auth'
    ],
    webpackBuildWorker: true
  },

  // Performance Monitoring
  productionBrowserSourceMaps: true,

  // Advanced Transpilation
  transpilePackages: [
    '@supabase/supabase-js',
    'next-auth'
  ]
};

// Optional: Sentry Integration for Error Tracking
export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'david-french',
    project: 'agent-chat-system'
  }
);