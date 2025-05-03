import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{tsx,css}',
    './src/papak/**/*.{tsx,css}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#4a90e2', // Primary blue from hero section
          brown: '#443b2c', // Brown color from images
          green: '#2ecc71', // Green for success indicators
        },
        secondary: {
          teal: '#35a8a8', // Teal from first blog image
          cream: '#f4ead5', // Cream background color
          lightGray: '#f8f8f8', // Light gray background
        },
        neutral: {
          white: '#ffffff',
          black: '#000000',
          gray: {
            100: '#f8f9fa',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
          },
        },
        text: {
          primary: '#333333', // Main text color
          secondary: '#666666', // Secondary text
          muted: '#999999', // Muted text
        },
        success: '#28a745', // Success state
        error: '#dc3545', // Error state
        warning: '#ffc107', // Warning state
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  important: true,

  plugins: [],
};
export default config;
