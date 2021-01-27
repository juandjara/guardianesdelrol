module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        cards: 'repeat(auto-fill, minmax(20rem, 1fr))'
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['hover'],
      opacity: ['disabled']
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}
