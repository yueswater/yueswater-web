import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8088",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8088",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "yueswater-server",
        port: "8088",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;