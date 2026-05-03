/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      colors: {
        ink:    '#172033',
        panel:  '#ffffff',
        card:   '#ffffff',
        border: '#d9e2ef',
        muted:  '#e8eef7',
        dim:    '#64748b',
        // ESI Brand
        esi:    '#1a56db',
        acid:   '#1a56db',
        'esi-dark': '#1240a8',
        'esi-light': '#3b7ef8',
        scarlet: '#e02424',
        'scarlet-dark': '#b91c1c',
        // Utility
        blue:   '#3b82f6',
        red:    '#ef4444',
        amber:  '#f59e0b',
        green:  '#22c55e',
        slate:  '#64748b',
      },
    },
  },
  plugins: [],
};
