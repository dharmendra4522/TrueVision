/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-deep': '#0A0A0F',
        'brand-cyan': '#00F5FF',
        'brand-amber': '#FF9500',
        'brand-red': '#FF3B3B',
        'brand-green': '#00FF88',
      },
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],
        'mono-jetbrains': ['JetBrains Mono', 'monospace'],
        'mono-space': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
