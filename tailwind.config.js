/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      primary: "#182939",
      secondary: "#AC4848",
      background: "#F8FBFD",
      accent: "#1BA721",
      white: "#FFFFFF",
      grey1: "#EBEBEB",
      grey2: "#959595",
      greyLight: "#F6F6F6",
      greyLight1: "#F4F4F4",
      greyLight2: "#F1F1F1",
      "primary-50": "#1829397F",
      "accent-dark": "#0d7c14",
      error: "#FF6B6B"
    },
    fontSize: {
      base: "1rem",
      md: "0.925rem",
      sm: "0.875rem",
      xs: "0.825rem",
      xxs: "0.75rem",
      xl: "2rem",
      lg: "1.2rem",
      "2xl": "50px"
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
