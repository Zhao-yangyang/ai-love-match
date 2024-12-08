const getEnvVar = (key: string) => {
  const value = process.env[key];
  if (!value) {
    // 在开发环境中抛出错误，在生产环境中使用默认值
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Missing ${key} environment variable`);
    }
    console.warn(`Warning: ${key} environment variable is not set`);
    return '';
  }
  return value;
};

export const config = {
  deepseekApiKey: getEnvVar('DEEPSEEK_API_KEY'),
  deepseekBaseUrl: 'https://api.deepseek.com/v1'
} as const; 