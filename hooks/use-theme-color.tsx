"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const colorThemes = [
	{
		name: "Purple",
		color: "oklch(0.488 0.243 264.376)",
		dark: "oklch(0.75 0.243 264.376)",
	},
	{
		name: "Blue",
		color: "oklch(0.6 0.118 184.704)",
		dark: "oklch(0.75 0.118 184.704)",
	},
	{
		name: "Green",
		color: "oklch(0.696 0.17 162.48)",
		dark: "oklch(0.75 0.17 162.48)",
	},
	{
		name: "Orange",
		color: "oklch(0.769 0.188 70.08)",
		dark: "oklch(0.75 0.188 70.08)",
	},
	{
		name: "Pink",
		color: "oklch(0.627 0.265 303.9)",
		dark: "oklch(0.8 0.265 303.9)",
	},
	{
		name: "Red",
		color: "oklch(0.645 0.246 16.439)",
		dark: "oklch(0.75 0.246 16.439)",
	},
	{ name: "Neutral", color: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
];

export function useThemeColor() {
	const [colorTheme, setColorTheme] = useState<
		(typeof colorThemes)[0] | null
	>(null);
	const { theme: currentTheme } = useTheme();

	const applyColor = (color: string) => {
		const root = document.documentElement;
		root.style.setProperty("--primary", color);
		root.style.setProperty("--ring", color);
		root.style.setProperty("--sidebar-primary", color);
		root.style.setProperty("--sidebar-ring", color);
	};

	const setColor = (theme: (typeof colorThemes)[0]) => {
		console.log("Setting theme color to:", theme);
		if (currentTheme === "dark") {
			applyColor(theme.dark);
			setColorTheme({ ...theme, color: theme.dark });
		} else {
			applyColor(theme.color);
			setColorTheme(theme);
		}
		localStorage.setItem("theme-color", theme.color);
	};

	useEffect(() => {
		const savedColor = localStorage.getItem("theme-color");
		if (savedColor) {
			const theme = colorThemes.find((t) => t.color === savedColor);
			if (theme) {
				if (currentTheme === "dark") {
					setColorTheme({ ...theme, color: theme.dark });
					applyColor(theme.dark);
				} else {
					setColorTheme(theme);
					applyColor(savedColor);
				}
			} else {
				if (currentTheme === "dark") {
					setColorTheme(colorThemes[0]);
					applyColor(colorThemes[0].dark);
				} else {
					setColorTheme(colorThemes[0]);
					applyColor(colorThemes[0].color);
				}
			}
		} else {
			if (currentTheme === "dark") {
				setColorTheme(colorThemes[0]);
				applyColor(colorThemes[0].dark);
			} else {
				setColorTheme(colorThemes[0]);
				applyColor(colorThemes[0].color);
			}
		}
	}, [currentTheme]);

	return {
		colorTheme: colorTheme || colorThemes[0], // Always return a valid theme
		setColor,
		colorThemes,
		isDark: currentTheme === "dark",
	};
}
