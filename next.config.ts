import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [256, 384, 640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
