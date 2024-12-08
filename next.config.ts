import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY!,
  },
  // Edge Runtime 配置
  experimental: {
    runtime: 'edge',
  }
};

export default nextConfig;
