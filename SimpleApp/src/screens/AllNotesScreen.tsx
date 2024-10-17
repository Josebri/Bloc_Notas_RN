import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BottomBar from "../components/BottomBar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useTheme } from "../context/ThemeContext"; // Importamos el contexto del tema

// Definimos el tipo de navegación
type AllNotesScreenNavigationProp = StackNavigationProp<RootStackParamList, "AllNotes">;

const AllNotesScreen: React.FC = () => {
	const navigation = useNavigation<AllNotesScreenNavigationProp>();
	const { isDarkMode } = useTheme(); // Obtenemos el estado del tema

	// Configuramos el botón "+" en la barra superior
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => navigation.navigate("CreateNote")}>
					<Icon name="add-outline" size={30} color={isDarkMode ? "#ffcc00" : "#000"} style={styles.addButton} />
					{/* El color será amarillo (#ffcc00) en modo oscuro */}
				</TouchableOpacity>
			),
		});
	}, [navigation, isDarkMode]);

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>All Notes Screen</Text>
			{/* Barra de navegación inferior */}
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
	addButton: {
		marginRight: 15,
	},
});

export default AllNotesScreen;
