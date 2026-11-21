import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/work/voyager-kids",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
