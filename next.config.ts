import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  partialPrefetching: true,
  cacheComponents: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
