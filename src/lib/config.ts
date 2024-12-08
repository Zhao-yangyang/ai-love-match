const REQUIRED_ENV_VARS = ['DEEPSEEK_API_KEY'] as const;

// 检查必需的环境变量
REQUIRED_ENV_VARS.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing ${envVar} environment variable`);
  }
});

export const config = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY!,
  deepseekBaseUrl: 'https://api.deepseek.com/v1'
} as const; 