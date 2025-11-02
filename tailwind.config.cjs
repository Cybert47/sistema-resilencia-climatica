module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        'primary-dark': '#cc0000',
        white: '#FFFFFF',
        'gray-light': '#F5F5F5',
        text: '#333333',
        black: '#000000'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
