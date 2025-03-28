// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your color palette
        primary: {
          dark: '#053b47',
          light: '#5e9299',
        },
      },
    },
  },
  plugins: [],
}