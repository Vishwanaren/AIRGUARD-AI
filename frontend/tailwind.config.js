/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10B981',
          satisfactory: '#84CC16',
          moderate: '#F59E0B',
          poor: '#EF4444',
          verypoor: '#8B5CF6',
          severe: '#991B1B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
