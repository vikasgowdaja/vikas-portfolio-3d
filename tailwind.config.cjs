/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#041715",
        secondary: "#97cfc7",
        tertiary: "#0b2d2a",
        "black-100": "#08221f",
        "black-200": "#051412",
        "white-100": "#dff6f1",
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
