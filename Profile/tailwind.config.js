/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    'white': '#ffffff',
    'purple': '#3f3cbb',
    'midnight': '#121063',
    'metal': '#565584',
    'tahiti': '#3ab7bf',
    'silver': '#ecebff',
    'bubble-gum': '#ff77e9',
    'bermuda': '#78dcca',
    'sunset': '#ff9f1c',
    'every': '#252525'
  },
  fontSize: {
    'sm': '0.8rem',
    'base': '1rem',
    'xl': '1.25rem',
    '2xl': '1.563rem',
    '3xl': '1.953rem',
    '4xl': '2.441rem',
    '5xl': '3.052rem',
  },
  screens: {
    'xs': { max: '500px' },
    'sm': {  max: '768px' },
    'xm': {max: '900px' },
    'md': {max: '1024px' },
    'mw': {max: '1280px' },
    'lg': {max: '1440px' },
    'xl': {max: '2560px' },
    '2xl': { min: '2560px' },
  },
};
export const plugins = [];