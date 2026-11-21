import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/work/ramses-mania",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
