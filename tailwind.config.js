/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "kulim-park": "var(--font-kulim-park)",
                khula: "var(--font-khula)",
            },
            colors: {
                main: "var(--main-color)",
                redcustom: "var(--text-red)",
            },
            boxShadow: {
                left: "var(--shadow-left)",
                right: "var(--shadow-right)",
                bottom: "var(--shadow-bottom)",
                custom: "var(--shadow-custom)",
            },
        },
    },
    plugins: [],
};
