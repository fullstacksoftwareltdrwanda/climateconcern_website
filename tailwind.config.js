/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core brand
        primary: '#00652c',
        'primary-container': '#15803d',
        'on-primary': '#ffffff',
        'on-primary-container': '#d3ffd5',
        'primary-fixed': '#95f8a7',
        'primary-fixed-dim': '#79db8d',
        'on-primary-fixed': '#00210a',
        'on-primary-fixed-variant': '#005323',
        'inverse-primary': '#79db8d',

        // Secondary
        secondary: '#006e2f',
        'secondary-container': '#6bff8f',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#007432',
        'secondary-fixed': '#6bff8f',
        'secondary-fixed-dim': '#4ae176',
        'on-secondary-fixed': '#002109',
        'on-secondary-fixed-variant': '#005321',

        // Tertiary
        tertiary: '#25623a',
        'tertiary-container': '#3f7b51',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#d0ffd7',
        'tertiary-fixed': '#b1f2be',
        'tertiary-fixed-dim': '#96d5a3',
        'on-tertiary-fixed': '#00210d',
        'on-tertiary-fixed-variant': '#12512c',

        // Error
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // Surface scale
        surface: '#f6faf6',
        'surface-dim': '#d6dbd7',
        'surface-bright': '#f6faf6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f5f1',
        'surface-container': '#eaefeb',
        'surface-container-high': '#e5e9e5',
        'surface-container-highest': '#dfe4e0',
        'surface-variant': '#dfe4e0',
        'surface-tint': '#006d30',
        'on-surface': '#181d1a',
        'on-surface-variant': '#3f493f',
        'inverse-surface': '#2c322f',
        'inverse-on-surface': '#edf2ee',

        // Background
        background: '#f6faf6',
        'on-background': '#181d1a',

        // Outline
        outline: '#6f7a6e',
        'outline-variant': '#becabc',

        // Hard borders/shadows (neo-brutalist ink)
        ink: '#0a0f0d',
        'ink-light': '#181d1a',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        'display-mobile': ['Space Grotesk', 'sans-serif'],
        'headline-lg': ['Space Grotesk', 'sans-serif'],
        'headline-md': ['Space Grotesk', 'sans-serif'],
        'headline-sm': ['Space Grotesk', 'sans-serif'],
        'headline-lg-mobile': ['Space Grotesk', 'sans-serif'],
        'body-lg': ['Hanken Grotesk', 'sans-serif'],
        'body-md': ['Hanken Grotesk', 'sans-serif'],
        'body-sm': ['Hanken Grotesk', 'sans-serif'],
        'label-lg': ['Space Mono', 'monospace'],
        'label-md': ['Space Mono', 'monospace'],
        'label-sm': ['Space Mono', 'monospace'],
        sans: ['Hanken Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '60px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-mobile': ['36px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['40px', { lineHeight: '46px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '700' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
        'label-sm': ['10px', { lineHeight: '14px', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      spacing: {
        'margin-mobile': '1rem',
        'gutter-mobile': '1rem',
        'margin-tablet': '2rem',
        'gutter-tablet': '1.5rem',
        'margin-desktop': '3rem',
        'gutter-desktop': '2rem',
        'grid-gap': '1.5rem',
        'layout-max-width': '80rem',
      },
      boxShadow: {
        hard2: '2px 2px 0px 0px #0a0f0d',
        hard3: '3px 3px 0px 0px #0a0f0d',
        hard4: '4px 4px 0px 0px #0a0f0d',
        hard6: '6px 6px 0px 0px #0a0f0d',
        hard8: '8px 8px 0px 0px #0a0f0d',
        'hard2-ink': '2px 2px 0px 0px #181d1a',
        'hard4-ink': '4px 4px 0px 0px #181d1a',
        'hard6-ink': '6px 6px 0px 0px #181d1a',
        none0: '0px 0px 0px 0px #0a0f0d',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        full: '9999px',
      },
      maxWidth: {
        'layout': '80rem',
      },
      keyframes: {
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulse: {
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
}
