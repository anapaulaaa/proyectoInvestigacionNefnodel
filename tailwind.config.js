/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: '#0E1F3A', cream: '#F6F1E7', orange: '#F58A4B', teal: '#3CC4BE' },
      fontFamily: { sans: ['Poppins', 'ui-sans-serif', 'system-ui'] }
    }
  },
  plugins: []
}
