import type { NextConfig } from "next";
import path from "node:path";

/** The site lives in site/ but reads ../skills and ../.claude-plugin at build time. */
const REPO_ROOT = path.join(__dirname, "..");
const REPO_FILES = ["../skills/**/*.md", "../.claude-plugin/plugin.json"];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingRoot: REPO_ROOT,
  outputFileTracingIncludes: {
    "/": REPO_FILES,
    "/skills/[name]": REPO_FILES,
  },
  turbopack: {
    root: REPO_ROOT,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
