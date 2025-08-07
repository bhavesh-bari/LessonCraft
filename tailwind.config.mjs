/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Your custom theme settings can go here
    },
  },
  // --- THIS IS THE CRUCIAL PART ---
  plugins: [
    require('@tailwindcss/typography'), // <-- Add this line
  ],
};
export default config;