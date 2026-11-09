import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/reactportfolio",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
