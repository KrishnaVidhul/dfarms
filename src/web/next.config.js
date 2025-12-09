/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for lower memory usage
  experimental: {
    turbo: undefined,
  },
  // Optimize for production
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
