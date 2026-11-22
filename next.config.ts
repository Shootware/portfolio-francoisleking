import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimise les images (remplace les placeholders par de vraies images)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default nextConfig;
