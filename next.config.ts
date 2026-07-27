import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "openweathermap.org" }],
  },
  reactStrictMode: true,
};

export default nextConfig;
