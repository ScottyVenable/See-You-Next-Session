/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Game theme colors
                'syns-bg': {
                    primary: '#1a1a2e',
                    secondary: '#16213e',
                    tertiary: '#0f3460',
                    card: '#242a33',
                },
                'syns-accent': {
                    DEFAULT: '#e94560',
                    hover: '#ff6b6b',
                },
                'syns-success': '#4ecdc4',
                'syns-warning': '#ffe66d',
                'syns-error': '#ef4444',
                'syns-text': {
                    DEFAULT: '#eaeaea',
                    muted: '#a0a0a0',
                    dark: '#333',
                },
                'syns-focus': {
                    high: '#4ecdc4',
                    medium: '#ffe66d',
                    low: '#e94560',
                },
                'syns-token': {
                    text: '#6c5ce7',
                    visual: '#00b894',
                },
                'syns-border': '#2f3640',
            },
            fontFamily: {
                header: ['Session Header', 'serif'],
                body: ['JMH Typewriter', 'monospace'],
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
            },
            boxShadow: {
                syns: '0 4px 8px rgba(0, 0, 0, 0.3)',
                'syns-lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
                'syns-glow': '0 0 20px rgba(233, 69, 96, 0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
