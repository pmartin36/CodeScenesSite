import type { NextConfig } from "next";

// Static export for Cloudflare Pages: `next build` emits a fully static site to ./out
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
