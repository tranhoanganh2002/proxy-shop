/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#1a1a1a',
        },
        sidebar: '#0f0f0f',
        text: {
          primary: '#ffffff',
          secondary: '#888888',
        },
        accent: {
          red: '#dc2626',
        },
        success: '#22c55e',
        warning: '#eab308',
      },
    },
  },
  plugins: [],
}
