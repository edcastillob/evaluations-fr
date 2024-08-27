/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: false, // Desactiva el modo oscuro
  corePlugins: {
    preflight: false, // Desactiva los estilos base por defecto
  },
  plugins: [],
}
