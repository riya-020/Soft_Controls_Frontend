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
                    lightBlue: '#005EB8', // Lighter accent blue
                    navy: '#001B41', // Dark blue for contrast
                    gray: '#F9FAFB', // Off-white for background
                    darkGray: '#1F2937', // For primary text
                    mediumGray: '#4B5563', // For secondary text
                }
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'solid': '6px 6px 0px 0px rgba(0, 51, 141, 0.15)', // Solid sharp shadow
            }
        },
    },
    plugins: [],
}
