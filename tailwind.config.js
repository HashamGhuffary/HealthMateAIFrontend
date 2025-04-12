/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Soft blue
        secondary: '#10B981', // Teal
        accent: '#8B5CF6', // Purple
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB',
        notification: '#EF4444',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

