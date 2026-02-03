import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gruvbox inspired palette with orange accent
        primary: '#E46E55',
        background: {
          light: '#fbf1c7', // gruvbox light bg
          dark: '#282828',   // gruvbox dark bg
        },
        foreground: {
          light: '#3c3836', // gruvbox dark gray
          dark: '#ebdbb2',  // gruvbox light fg
        },
        surface: {
          light: '#f9f5d7', // gruvbox light surface
          dark: '#3c3836',  // gruvbox dark surface
        },
        border: {
          light: '#d5c4a1', // gruvbox light border
          dark: '#665c54',  // gruvbox dark border
        },
        muted: {
          light: '#7c6f64', // gruvbox gray
          dark: '#a89984',  // gruvbox light gray
        },
      },
      fontFamily: {
        heading: ['var(--font-styrene)'],
        ui: ['var(--font-styrene)'],
        body: ['var(--font-tiempos)'],
      },
      letterSpacing: {
        tightish: "-0.01em"
      },
      boxShadow: {
        window: '0 10px 30px rgba(0,0,0,0.15)',
        'window-dark': '0 10px 30px rgba(0,0,0,0.5)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'inherit',
            },
            a: {
              color: '#cc7a59',
              textDecoration: 'underline',
              '&:hover': {
                color: '#d88b6f',
              },
            },
            ul: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            ol: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;