import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["better-auth", "@better-auth/drizzle-adapter", "@google/generative-ai"],
};

export default nextConfig;
