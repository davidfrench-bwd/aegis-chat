/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove deprecated swcMinify option
  output: 'standalone', // Helps with Vercel deployment
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://chat.davidfrench.io'
  },
  // Optional: Configure webpack if needed
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,  // Disable fs module for client-side
      net: false,
      tls: false 
    };
    return config;
  }
};

module.exports = nextConfig;