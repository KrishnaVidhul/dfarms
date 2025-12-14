/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // swcMinify is enabled by default in Next.js 13+
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
