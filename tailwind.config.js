/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-mode="dark"]'], // Usar 'class' también puede funcionar bien
  content: ["./src/**/*.{handlebars,html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
