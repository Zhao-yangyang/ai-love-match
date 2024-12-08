const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
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
  deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
} as const; 