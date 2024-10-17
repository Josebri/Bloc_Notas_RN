import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext"; // Importamos el contexto del tema

const CreateNoteScreen: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("black");
	const [fontSize, setFontSize] = useState("14");
	const [fontType, setFontType] = useState("Arial");
	const [isFavorite, setIsFavorite] = useState(false);

	const { isDarkMode } = useTheme(); // Obtenemos el estado del tema

	const handleCreateNote = async () => {
		try {
			const response = await fetch("http://192.168.0.114:5000/notes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					color,
					font_size: fontSize,
					font_type: fontType,
					is_favorite: isFavorite,
				}),
			});

			if (response.ok) {
				console.log("Nota creada con éxito");
			} else {
				console.log("Error al crear la nota");
			}
		} catch (error) {
			console.log("Error de red", error);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#555" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Title (max 100 chars)" value={title} onChangeText={setTitle} maxLength={100} placeholderTextColor={isDarkMode ? "#aaa" : "#666"} />
			<TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#555" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Description (max 250 chars)" value={description} onChangeText={setDescription} maxLength={250} placeholderTextColor={isDarkMode ? "#aaa" : "#666"} />

			<Picker selectedValue={color} onValueChange={(itemValue: string) => setColor(itemValue)}>
				<Picker.Item label="Black" value="black" />
				<Picker.Item label="Red" value="red" />
				<Picker.Item label="Blue" value="blue" />
			</Picker>

			<Picker selectedValue={fontSize} onValueChange={(itemValue: string) => setFontSize(itemValue)}>
				<Picker.Item label="12" value="12" />
				<Picker.Item label="14" value="14" />
				<Picker.Item label="16" value="16" />
				<Picker.Item label="18" value="18" />
			</Picker>

			<Picker selectedValue={fontType} onValueChange={(itemValue: string) => setFontType(itemValue)}>
				<Picker.Item label="Arial" value="Arial" />
				<Picker.Item label="Roboto" value="Roboto" />
				<Picker.Item label="Times New Roman" value="Times New Roman" />
			</Picker>

			<TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!isFavorite)}>
				<Text style={styles.favoriteButtonText}>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.createButton} onPress={handleCreateNote}>
				<Text style={styles.createButtonText}>Create Note</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		justifyContent: "center",
	},
	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	favoriteButton: {
		backgroundColor: "#f1c40f",
		paddingVertical: 10,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 20,
	},
	favoriteButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	createButton: {
		backgroundColor: "#3498db",
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	createButtonText: {
		color: "#fff",
		fontSize: 16,
	},
});

export default CreateNoteScreen;
