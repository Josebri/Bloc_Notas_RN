import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomBar from "../components/BottomBar";
import { useTheme } from "../context/ThemeContext"; // Importamos el contexto del tema

const FavoriteNotesScreen: React.FC = () => {
	const { isDarkMode } = useTheme(); // Obtenemos el estado del tema

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Favorite Notes Screen</Text>

			{/* Barra de navegación */}
			<BottomBar />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	text: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
});

export default FavoriteNotesScreen;
