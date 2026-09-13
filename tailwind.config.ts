import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#3A4B40',
                    light: '#FBFBF9',
                }
            },
            fontFamily: {
                sans: ['var(--font-quicksand)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;