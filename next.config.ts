import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from all HTTPS/HTTP sources (backend uploads, S3, CDN, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
