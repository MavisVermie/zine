/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fuchsia: '#FF2D9C',
        blue: '#0B66FF',
      },
    },
  },
  plugins: [],
}
