/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                kpmg: {
                    blue: '#00338D', // Corporate blue
                    lightBlue: '#E2E8F0', // Light grey/blue for accents
                    gray: '#F3F4F6', // Off-white for background
                }
            }
        },
    },
    plugins: [],
}
