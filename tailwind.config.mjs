/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // red, purple, yellow, green
  safelist: [
    "border-red-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
    "bg-red-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100"
  ],
  theme: {
    extend: {
      
    },
  },

  plugins: [
    require('@tailwindcss/typography'), // <-- Add this line
  ],
};
export default config;