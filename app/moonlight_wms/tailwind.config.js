/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070b14',
          900: '#0d1117',
          850: '#111620',
          800: '#161b22',
          750: '#1a2030',
          700: '#1c2230',
          600: '#21262d',
          500: '#2d333b',
          400: '#373e47',
          300: '#444c56',
          200: '#586069',
        },
        brand: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
          light: '#4ade80',
          muted: '#15803d',
          glow: 'rgba(34,197,94,0.25)',
        },
        surface: {
          DEFAULT: '#161b22',
          raised: '#1c2230',
          overlay: '#21262d',
          sunken: '#0d1117',
        },
        /* Neumorphism palette (login/signup pages) */
        neu: {
          bg:       '#e0e5ec',
          dark:     '#bec3cf',
          light:    '#ffffff',
          text:     '#3d4468',
          muted:    '#9499b7',
          subtle:   '#6c7293',
          accent:   '#22c55e',
        },
      },
      fontFamily: {
        sans:    ['DM Sans',       'system-ui', 'sans-serif'],
        display: ['Nunito',        'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono','Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'glow-sm':    '0 0 12px rgba(34,197,94,0.2)',
        'glow':       '0 0 20px rgba(34,197,94,0.25)',
        'glow-lg':    '0 0 32px rgba(34,197,94,0.3)',
        'card':       '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
        'elevated':   '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'inner-top':  'inset 0 1px 0 rgba(255,255,255,0.04)',
        /* Neumorphism shadows */
        'neu':        '20px 20px 60px #bec3cf, -20px -20px 60px #ffffff',
        'neu-sm':     '8px 8px 24px #bec3cf, -8px -8px 24px #ffffff',
        'neu-inset':  'inset 8px 8px 16px #bec3cf, inset -8px -8px 16px #ffffff',
        'neu-btn':    '6px 6px 16px #bec3cf, -6px -6px 16px #ffffff',
        'neu-btn-active': 'inset 4px 4px 10px #bec3cf, inset -4px -4px 10px #ffffff',
        'neu-icon':   '5px 5px 12px #bec3cf, -5px -5px 12px #ffffff',
      },
      backgroundImage: {
        'gradient-card':    'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
        'gradient-brand':   'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-neu':     'linear-gradient(145deg, #e6ecf4, #d9dfe7)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'neu-float':    'neuFloat 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        neuFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
