import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        turmeric: '#F4A300',
        turmericLight: '#FEF3D6',
        ivory: '#F8F3E8',
        ivoryDark: '#EDE8D8',
        mocha: '#5C3A21',
        mochaLight: '#8B6347',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
