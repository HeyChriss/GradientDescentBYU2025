import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally disable TypeScript errors during builds as well
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
