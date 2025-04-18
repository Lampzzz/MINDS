/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // DEFAULT: "#EA580C",
          DEFAULT: "#F97316",
          100: "#FFEDD5",
        },
        secondary: "#F5F5F4",
        white: {
          DEFAULT: "#FFFFFF",
          100: "#F5F5F4",
        },
        gray: {
          DEFAULT: "#696969",
          100: "#E7E5E4",
        },
        black: {
          DEFAULT: "#1C1917",
        },
        border: "#E7E5E4",
        text: "#262626",
        "input-border": "#0C0A09",
        "input-border-selected": "#171717",
        "input-text": "#44403C",
        "fill-secondary": "#F5F5F4",
        "text-secondary": "#525252",
        "surface-success": "#DCFCE7",
        "text-success": "#166534",
        "icon-success": "#15803D",
        "icon-critical": "#B91C1C",
        icon: "#2E2E2E",
      },
      fontFamily: {
        "urbanist-extralight": ["Urbanist-ExtraLight", "sans-serif"],
        "urbanist-light": ["Urbanist-Light", "sans-serif"],
        "urbanist-regular": ["Urbanist-Regular", "sans-serif"],
        "urbanist-medium": ["Urbanist-Medium", "sans-serif"],
        "urbanist-semibold": ["Urbanist-SemiBold", "sans-serif"],
        "urbanist-bold": ["Urbanist-Bold", "sans-serif"],
        "urbanist-extrabold": ["Urbanist-ExtraBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
