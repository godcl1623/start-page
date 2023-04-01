/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
        screens: {
            xs: "360px",
            ...defaultTheme.screens,
        },
    },
    plugins: [],
};
