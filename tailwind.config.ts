import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
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
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
      }
    },
  },
  plugins: [typography],
};

export default config;
