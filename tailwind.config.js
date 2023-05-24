const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

const excludedColors = [
  // deprecated
  "lightBlue", "warmGray", "trueGray", "coolGray", "blueGray",
  // add here colors to be replaced
]
const defaultColors = Object.keys(colors).reduce((obj, key) => {
  if (!excludedColors.includes(key)) {
    obj[key] = colors[key]
  }
  return obj
}, {})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        "4xl": "2rem"
      },
      minWidth: defaultTheme.width,
      maxWidth: defaultTheme.width,
      minHeight: defaultTheme.height,
      maxHeight: defaultTheme.height,
      zIndex: {
        1: "1"
      }
    },
    colors: {
      ...defaultColors
    }
  },
  plugins: []
}
