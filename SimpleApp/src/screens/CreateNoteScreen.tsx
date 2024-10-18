import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Importamos useNavigation

const CreateNoteScreen: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("black");
	const [size, setFontSize] = useState("14");
	const [font, setFontType] = useState("Arial");
	const [category, setCategory] = useState("");
	const [is_favorite, setIsFavorite] = useState(false);

	const { isDarkMode } = useTheme();
	const navigation = useNavigation(); // Inicializamos useNavigation

	const handleCreateNote = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch("http://192.168.0.114:5000/notes", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Enviamos el token al backend
					},
					body: JSON.stringify({
						title,
						description,
						color,
						size,
						font,
						category,
						is_favorite,
					}),
				});

				if (response.ok) {
					const newNote = await response.json();
					// Redirigir dependiendo de si la nota es favorita o no
					if (is_favorite) {
						navigation.navigate("FavoriteNotes", { newNote }); // Redirigir a favoritos si es favorita
					} else {
						navigation.navigate("AllNotes", { newNote }); // Redirigir a AllNotes si no es favorita
					}
				}
			}
		} catch (error) {
			console.log("Error de red", error);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#555" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Title (max 100 chars)" value={title} onChangeText={setTitle} maxLength={100} placeholderTextColor={isDarkMode ? "#aaa" : "#666"} />
			<TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#555" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Description (max 250 chars)" value={description} onChangeText={setDescription} maxLength={250} placeholderTextColor={isDarkMode ? "#aaa" : "#666"} />
			<TextInput style={[styles.input, { backgroundColor: isDarkMode ? "#555" : "#fff", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Category (max 40 chars)" value={category} onChangeText={setCategory} maxLength={40} placeholderTextColor={isDarkMode ? "#aaa" : "#666"} />

			<Picker selectedValue={color} onValueChange={(itemValue: string) => setColor(itemValue)}>
				<Picker.Item label="Black" value="black" />
				<Picker.Item label="Red" value="red" />
				<Picker.Item label="Blue" value="blue" />
			</Picker>

			<Picker selectedValue={size} onValueChange={(itemValue: string) => setFontSize(itemValue)}>
				<Picker.Item label="12" value="12" />
				<Picker.Item label="14" value="14" />
				<Picker.Item label="16" value="16" />
				<Picker.Item label="18" value="18" />
			</Picker>

			<Picker selectedValue={font} onValueChange={(itemValue: string) => setFontType(itemValue)}>
				<Picker.Item label="Arial" value="Arial" />
				<Picker.Item label="Roboto" value="Roboto" />
				<Picker.Item label="Times New Roman" value="Times New Roman" />
			</Picker>

			<TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!is_favorite)}>
				<Text style={styles.favoriteButtonText}>{is_favorite ? "Remove from Favorites" : "Add to Favorites"}</Text>
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
