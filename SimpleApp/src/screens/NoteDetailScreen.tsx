import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Note = {
	id: string;
	title: string;
	description: string;
	color: string;
	size: string;
	font: string;
	category: string;
	is_favorite: boolean;
};

const NoteDetailScreen: React.FC = () => {
	const [note, setNote] = useState<Note | null>(null);
	const [error, setError] = useState<string | null>(null); // Estado para manejar errores
	const [loading, setLoading] = useState(true); // Estado de carga
	const route = useRoute();
	const { noteId } = route.params as { noteId: string };
	const { isDarkMode } = useTheme();

	useEffect(() => {
		const fetchNote = async () => {
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
						const noteData = await response.json();
						setNote(noteData);
					} else {
						const errorData = await response.json();
						setError("Error al cargar la nota: " + errorData.error);
					}
				} else {
					setError("No se encontró el token de autenticación.");
				}
			} catch (error) {
				setError("Error de red al cargar la nota.");
			} finally {
				setLoading(false); // Siempre cambiamos el estado de carga al finalizar
			}
		};

		fetchNote();
	}, [noteId]);

	if (loading) {
		return (
			<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
				<Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Cargando nota...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
				<Text style={[styles.text, { color: "red" }]}>{error}</Text>
			</View>
		);
	}

	if (!note) {
		return (
			<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
				<Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Nota no encontrada</Text>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>{note.title}</Text>
			<Text style={[styles.description, { color: isDarkMode ? "#aaa" : "#000" }]}>{note.description}</Text>
			<Text style={[styles.metaData, { color: isDarkMode ? "#ccc" : "#666" }]}>Color: {note.color}</Text>
			<Text style={[styles.metaData, { color: isDarkMode ? "#ccc" : "#666" }]}>Tamaño: {note.size}</Text>
			<Text style={[styles.metaData, { color: isDarkMode ? "#ccc" : "#666" }]}>Fuente: {note.font}</Text>
			<Text style={[styles.metaData, { color: isDarkMode ? "#ccc" : "#666" }]}>Categoría: {note.category}</Text>
			<Text style={[styles.metaData, { color: isDarkMode ? "#ccc" : "#666" }]}>Favorita: {note.is_favorite ? "Sí" : "No"}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	text: {
		fontSize: 18,
		textAlign: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	description: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: "center",
	},
	metaData: {
		fontSize: 14,
		marginVertical: 5,
		textAlign: "center",
	},
});

export default NoteDetailScreen;
