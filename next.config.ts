import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "*" },
    ],
  },
  // Turbopack configuration (moved from experimental.turbo)
  // Note: Webpack config below is kept for non-Turbopack builds
  // The warning about Webpack/Turbopack is informational and can be ignored
  turbopack: {},
  // Keep webpack config for non-Turbopack builds (fallback)
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
