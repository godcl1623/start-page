/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
        screens: {
            xs: "360px",
            fhd: "1920px",
            ...defaultTheme.screens,
        },
        fontFamily: {
            sans: ["var(--font-pretendard)"],
        },
    },
    darkMode: "selector",
    plugins: [],
};
