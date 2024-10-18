import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const NotesScreen: React.FC = () => {
	const navigation = useNavigation();
	const { isDarkMode } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Welcome to Notes</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: 18,
	},
});

export default NotesScreen;
