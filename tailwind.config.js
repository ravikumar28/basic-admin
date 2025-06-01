module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff5eb",
          100: "#fee6d2",
          200: "#fdcaa5",
          300: "#fba978",
          400: "#f9884a",
          500: "#f67006", //primary color
          600: "#e05a05",
          700: "#ba4908",
          800: "#953a0d",
          900: "#7a320f",
          950: "#461704",
        },
      },
      fontFamily: {
        sans: ['General Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};