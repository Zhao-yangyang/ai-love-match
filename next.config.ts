import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  },
  experimental: {
    serverComponentsExternalPackages: ['openai']
  }
};

export default nextConfig;
