/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{index,vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      heading: `'Belanosima', sans-serif`,
    },

    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}

