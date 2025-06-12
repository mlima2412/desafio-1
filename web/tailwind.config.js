import { theme } from "tailwindcss/defaultConfig";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["OpenSans", ...theme.fontFamily.sans],
			},
			colors: {
				blue_base: "#2C46B1",
				blue_dark: "#2C4091",
				dager: "#FF0000",
			},
			gray: {
				100: "#F9F9FB",
				200: "#E4E6EC",
				300: "#CDCFD5",
				400: "#74798B",
				500: "#4D505C",
				600: "#1F2025",
			},
		},
	},
	plugins: [],
};
