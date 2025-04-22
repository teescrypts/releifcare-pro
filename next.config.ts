import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: isDev ? "http" : "https",
        hostname: isDev ? "localhost" : "realtyillustrations.live",
        port: isDev ? "3000" : "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Allow images from Cloudinary
        pathname: "/**",
      },
    ],
  },
  experimental: {
    taint: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
