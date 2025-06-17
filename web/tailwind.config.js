import { theme } from "tailwindcss/defaultConfig";
import { lazy } from "zod/v4-mini";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				"loading-bar": {
					"0%": { backgroundPosition: "200% 0" },
					"100%": { backgroundPosition: "0 0" },
				},
			},
			animation: {
				"loading-bar": "loading-bar 1.5s linear infinite",
			},
			fontFamily: {
				sans: ["OpenSans", ...theme.fontFamily.sans],
			},
			colors: {
				blue_base: "#2C46B1",
				blue_dark: "#2C4091",
				danger: "#FF0000",
			},
			gray: {
				100: "#F9F9FB",
				200: "#E4E6EC",
				300: "#CDCFD5",
				400: "#74798B",
				500: "#4D505C",
				600: "#1F2025",
			},
			fontSize: {
				xl: ["1.5rem", { lineHeight: "2rem" }],
				lg: ["1.125rem", { lineHeight: "1.5rem" }],
				md: ["0.875rem", { lineHeight: "1.125rem" }],
				sm: ["0.75rem", { lineHeight: "1rem" }],
				xs: ["0.625rem", { lineHeight: "1rem" }],
			},
		},
	},
	plugins: [],
};
