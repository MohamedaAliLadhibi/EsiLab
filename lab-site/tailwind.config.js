/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        ink: '#0f1b34',
        panel: '#f7fbff',
        line: '#d4deed',
        mist: '#eaf3fb',
        cloud: '#f2f7fc',
        blue: '#1f57b8',
        navy: '#14264f',
        cyan: '#48c6df',
        lime: '#a4b118',
        orange: '#f47b28',
        scarlet: '#ec3237',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(72,198,223,0.2), transparent 30%), linear-gradient(135deg, rgba(20,38,79,0.95), rgba(15,27,52,0.98))',
        'hero-mesh':
          'radial-gradient(circle at 15% 20%, rgba(72,198,223,0.22), transparent 22%), radial-gradient(circle at 85% 18%, rgba(244,123,40,0.20), transparent 18%), linear-gradient(160deg, rgba(20,38,79,0.98), rgba(10,21,44,0.96))',
      },
      boxShadow: {
        halo: '0 30px 80px rgba(20, 38, 79, 0.18)',
        soft: '0 18px 48px rgba(31, 57, 105, 0.1)',
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
