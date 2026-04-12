import type { NextConfig } from "next";

const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  ...(isExport && { output: "export" }),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
