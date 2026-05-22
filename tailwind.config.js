import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#f16610',
          secondary: '#ff8a3c',
          accent: '#ffd19b',
          dark: '#0f172a',
          darker: '#05070f',
          light: '#fff7f0',
          grey: '#f4e9df',
        },
        // FIX-039: CMS admin surface tokens. Collapses ~10 near-identical warm
        // hex values across the admin panel into 4 semantic slots: canvas
        // (body), soft (subdued surface), hover (orange-tinted active surface),
        // and rule (borders/dividers).
        cms: {
          canvas: '#f7f3ee',
          soft: '#fffaf5',
          hover: '#fff3e8',
          rule: '#e8dccf',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #f16610 0%, #ff8a3c 50%, #ffd19b 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1c2536 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'bar-grow': 'barGrow 1.4s ease-out forwards',
        'ticker': 'ticker 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.8s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'dash': 'dash 3s ease-in-out infinite',
        'orbit': 'orbit 14s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        barGrow: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        ticker: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dash: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [typography],
}
