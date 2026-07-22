import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disabled: cache writes caused OOM spikes on this machine (24GB RAM,
    // 20-core worker pool) and Turbopack flagged its own cache as corrupt once.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
