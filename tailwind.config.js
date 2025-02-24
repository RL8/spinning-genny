/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'swift-purple': '#6B3FA0',
        'swift-gold': '#FFD700',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
