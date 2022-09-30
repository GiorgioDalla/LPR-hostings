module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            height: {
                128: "32rem",
            },
            cursor: {
                default: "url(/images/red.png), default",
            },
            borderWidth: {
                16: "16px",
            },
        },
    },
    plugins: [],
}
