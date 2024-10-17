import React, { createContext, useContext, useState, ReactNode } from "react";
import { Appearance, useColorScheme } from "react-native";

// Definir el tipo para el contexto
type ThemeContextType = {
	isDarkMode: boolean;
	toggleTheme: () => void;
};

// Crear el contexto con valores por defecto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook para usar el contexto
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme debe ser usado dentro de ThemeProvider");
	}
	return context;
};

// Componente ThemeProvider para proveer el contexto a la app
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const colorScheme = useColorScheme();
	const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

	const toggleTheme = () => {
		setIsDarkMode((previousState) => !previousState);
	};

	return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};
