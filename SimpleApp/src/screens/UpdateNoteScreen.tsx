import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type UpdateNoteScreenNavigationProp = StackNavigationProp<RootStackParamList, "UpdateNote">;

interface RouteParams {
	noteId: number;
}

const UpdateNoteScreen: React.FC = () => {
	const { isDarkMode } = useTheme();
	const navigation = useNavigation<UpdateNoteScreenNavigationProp>();
	const route = useRoute();
	const { noteId } = route.params as RouteParams; // Recoge el ID de la nota desde los parámetros de la ruta

	// Estados para los detalles de la nota
	const [noteDetails, setNoteDetails] = useState({
		title: "",
		description: "",
		color: "",
		size: "",
		font: "",
		category: "",
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar los detalles de la nota existente al cargar la pantalla
	useEffect(() => {
		const loadNoteDetails = async () => {
			try {
				const token = await AsyncStorage.getItem("token");
				if (token) {
					const response = await fetch(`http://192.168.0.114:5000/notes/${noteId}`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setNoteDetails(data); // Carga los detalles de la nota en el estado
					} else {
						const errorData = await response.text();
						setError("Error al cargar los detalles de la nota: " + errorData);
					}
				} else {
					setError("No se encontró el token de autenticación.");
				}
			} catch (error) {
				setError("Error de red al cargar los detalles de la nota.");
			} finally {
				setLoading(false);
			}
		};

		loadNoteDetails();
	}, [noteId]);

	// Función para actualizar la nota
	const handleUpdateNote = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch(`http://192.168.0.114:5000/notes/${noteId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(noteDetails),
				});

				if (response.ok) {
					Alert.alert("Éxito", "La nota se ha actualizado correctamente.");
					navigation.goBack(); // Vuelve a la pantalla anterior después de actualizar
				} else {
					const errorData = await response.json();
					setError("Error al actualizar la nota: " + errorData.error);
				}
			}
		} catch (error) {
			setError("Error de red al actualizar la nota.");
		}
	};

	if (loading) {
		return <Text style={styles.loadingText}>Cargando...</Text>;
	}

	if (error) {
		return <Text style={styles.errorText}>{error}</Text>;
	}

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.header, { color: isDarkMode ? "#fff" : "#000" }]}>Editar Nota</Text>

			<TextInput style={styles.input} placeholder="Título" value={noteDetails.title} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, title: text }))} />

			<TextInput style={styles.input} placeholder="Descripción" value={noteDetails.description} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, description: text }))} />

			<TextInput style={styles.input} placeholder="Color" value={noteDetails.color} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, color: text }))} />

			<TextInput style={styles.input} placeholder="Tamaño" value={noteDetails.size} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, size: text }))} />

			<TextInput style={styles.input} placeholder="Fuente" value={noteDetails.font} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, font: text }))} />

			<TextInput style={styles.input} placeholder="Categoría" value={noteDetails.category} onChangeText={(text) => setNoteDetails((prev) => ({ ...prev, category: text }))} />

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={handleUpdateNote}>
					<Text style={styles.buttonText}>Guardar Cambios</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
					<Text style={styles.buttonText}>Cancelar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 10,
		marginVertical: 10,
		backgroundColor: "#f1f1f1",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	button: {
		backgroundColor: "#3498db",
		padding: 15,
		borderRadius: 5,
		width: "48%",
		alignItems: "center",
	},
	buttonCancel: {
		backgroundColor: "#e74c3c",
		padding: 15,
		borderRadius: 5,
		width: "48%",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
	loadingText: {
		fontSize: 18,
		textAlign: "center",
		marginTop: 20,
	},
	errorText: {
		fontSize: 18,
		color: "red",
		textAlign: "center",
		marginTop: 20,
	},
});

export default UpdateNoteScreen;
