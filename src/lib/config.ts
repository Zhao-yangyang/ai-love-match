if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error('Missing DEEPSEEK_API_KEY environment variable');
}

export const config = {
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  deepseekBaseUrl: 'https://api.deepseek.com/v1'
} as const; 