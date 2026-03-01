/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        copperplate: ['Copperplate', 'Copperplate Gothic Light', 'Cinzel', 'serif'],
      },
      colors: {
        bg: '#000000',
        'btn-white': '#ffffff',
        'btn-black': '#1a1a1a',
        paid: '#22c55e',
        unpaid: '#ef4444',
      },
    },
  },
  plugins: [],
};
