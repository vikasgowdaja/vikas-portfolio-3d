/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "Segoe UI", "Helvetica Neue", "Arial"],
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        "black-100": "rgb(var(--color-black-100) / <alpha-value>)",
        "black-200": "rgb(var(--color-black-200) / <alpha-value>)",
        "white-100": "rgb(var(--color-white-100) / <alpha-value>)",
      },
      boxShadow: {
        card: "0px 35px 120px -15px rgba(7, 34, 31, 0.55)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "repeating-linear-gradient(0deg, rgba(219, 252, 247, 0.06) 0px, rgba(219, 252, 247, 0.06) 2px, transparent 2px, transparent 84px), radial-gradient(circle at 12% 18%, rgba(88, 225, 210, 0.22), transparent 24%), radial-gradient(circle at 86% 14%, rgba(16, 99, 84, 0.26), transparent 18%), linear-gradient(135deg, rgba(11, 45, 42, 0.96) 0%, rgba(4, 23, 21, 0.98) 56%, rgba(2, 10, 9, 1) 100%)",
      },
    },
  },
  plugins: [],
};
