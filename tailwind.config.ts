import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        blink: 'blink 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            maxWidth: 'none',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary-foreground)',
              },
            },
            h1: { color: 'var(--foreground)' },
            h2: { 
              color: 'var(--foreground)',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            h3: { color: 'var(--foreground)' },
            strong: { color: 'var(--foreground)' },
            code: { color: 'var(--primary)' },
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            ul: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            blockquote: { 
              color: 'var(--foreground)',
              borderLeftColor: 'var(--primary)',
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1em',
            }
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
