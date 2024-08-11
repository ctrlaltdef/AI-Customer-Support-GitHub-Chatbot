
// tailwind.config.js
module.exports = {
  content: [
    'app/page.js'
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hidden': {
          'scrollbar-width': 'none',  // Firefox
          '-ms-overflow-style': 'none',  // Internet Explorer and Edge
        },
        '.scrollbar-hidden::-webkit-scrollbar': {
          display: 'none',  // Chrome, Safari, and Opera
        },
      });
    },
  ],
}
