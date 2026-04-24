/** @type {import('tailwindcss').Config} */
export default {
  // Class strategy: add `class="dark"` on `<html>` (default) so `dark:*` utilities
  // match the active theme. Base styles use dark palette; use `dark:` later for light overrides if needed.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#020617',
          muted: '#0f172a',
          raised: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
