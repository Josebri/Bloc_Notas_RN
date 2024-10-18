import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import BottomBar from "../components/BottomBar";
import SearchBar from "../components/SearchBar";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import ModalOptions from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

type AllNotesScreenNavigationProp = StackNavigationProp<RootStackParamList, "AllNotes">;

const AllNotesScreen: React.FC = () => {
	const { isDarkMode } = useTheme();
	const navigation = useNavigation<AllNotesScreenNavigationProp>();
	const route = useRoute();
	const [notes, setNotes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedNote, setSelectedNote] = useState<{ id: number; is_favorite: boolean } | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	// Función de búsqueda
	const handleSearch = async () => {
		if (searchQuery.trim() === "") {
			loadNotes();
			return;
		}

		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch("http://192.168.0.114:5000/notes/search", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ query: searchQuery, is_favorite: false }),
				});

				if (response.ok) {
					const result = await response.json();
					setNotes(result);
				} else {
					const errorData = await response.text();
					setError(`Error en la búsqueda. Detalle: ${errorData}`);
				}
			}
		} catch (error) {
			setError("Error de red al realizar la búsqueda.");
		}
	};

	// Cargar las notas que no son favoritas
	const loadNotes = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch(`http://192.168.0.114:5000/notes/unfavorite`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setNotes(data);
					setError(null);
				} else {
					const errorData = await response.text();
					setError("Error al cargar las notas. Detalle: " + errorData);
				}
			} else {
				setError("No se encontró el token de autenticación.");
			}
		} catch (error) {
			setError("Error de red al cargar las notas.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadNotes();
	}, []);
	useEffect(() => {
		if (route.params?.newNote) {
			setNotes((prevNotes) => [route.params.newNote, ...prevNotes]);
		}
	}, [route.params?.newNote]);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => navigation.navigate("CreateNote")}>
					<Icon name="add-outline" size={30} color={isDarkMode ? "#ffcc00" : "#000"} style={styles.addButton} />
				</TouchableOpacity>
			),
		});
	}, [navigation, isDarkMode]);

	// Eliminar una nota
	const deleteNote = async (noteId: number) => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch(`http://192.168.0.114:5000/notes/${noteId}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId)); // Actualizar estado localmente
					hideModal(); // Cerrar el modal después de eliminar
				}
			}
		} catch (error) {
			console.log("Error eliminando la nota", error);
		}
	};

	// Alternar favorito
	const toggleFavorite = async (noteId: number, isFavorite: boolean) => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const response = await fetch(`http://192.168.0.114:5000/notes/${noteId}/favorite`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ is_favorite: !isFavorite }),
				});

				if (response.ok) {
					loadNotes();
					hideModal();
				} else {
					console.log("Error al cambiar el estado de favorito");
				}
			}
		} catch (error) {
			console.log("Error al cambiar el estado de favorito", error);
		}
	};

	//Mostrar modal
	const showModal = (noteId: number, isFavorite: boolean) => {
		setSelectedNote({ id: noteId, is_favorite: isFavorite });
		setIsModalVisible(true);
	};

	// Ocultar modal
	const hideModal = () => {
		setIsModalVisible(false);
	};

	// Navegar a la pantalla de editar nota
	const handleEditNote = (noteId: number) => {
		navigation.navigate("UpdateNote", { noteId });
	};

	const renderNote = ({ item }: { item: any }) => (
		<View style={styles.noteCard}>
			{/* Cuando se toca el título, navega al detalle de la nota */}
			<TouchableOpacity onPress={() => handleEditNote(item.id)}>
				<Text style={[styles.noteTitle, { color: isDarkMode ? "#fff" : "#000" }]}>{item.title}</Text>
			</TouchableOpacity>

			{/* Botón de tres puntos para mostrar opciones */}
			<TouchableOpacity style={styles.moreButton} onPress={() => showModal(item.id, item.is_favorite)}>
				<Icon name="ellipsis-horizontal" size={24} color={isDarkMode ? "#fff" : "#000"} />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			{/* Barra de búsqueda */}
			<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />

			{loading ? <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Cargando notas...</Text> : error ? <Text style={[styles.text, { color: "red" }]}>{error}</Text> : notes.length > 0 ? <FlatList data={notes} renderItem={renderNote} keyExtractor={(item) => item.id.toString()} /> : <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>No hay notas</Text>}

			<BottomBar />

			{/* Modal para las opciones de la nota */}
			<ModalOptions isVisible={isModalVisible} onBackdropPress={hideModal}>
				<View style={styles.modalContent}>
					<TouchableOpacity onPress={() => handleEditNote(selectedNote?.id ?? 0)}>
						<Text style={styles.modalOption}>Editar nota</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => toggleFavorite(selectedNote!.id, selectedNote!.is_favorite)}>
						<Text style={styles.modalOption}>{selectedNote?.is_favorite ? "Quitar de favoritos" : "Agregar a favoritos"}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => deleteNote(selectedNote!.id)}>
						<Text style={[styles.modalOption, styles.deleteOption]}>Eliminar nota</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={hideModal}>
						<Text style={styles.modalCancel}>Cancelar</Text>
					</TouchableOpacity>
				</View>
			</ModalOptions>
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
	noteCard: {
		padding: 15,
		marginVertical: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		position: "relative",
	},
	noteTitle: {
		fontSize: 16,
	},
	moreButton: {
		position: "absolute",
		right: 15,
		top: 15,
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalOption: {
		fontSize: 18,
		paddingVertical: 10,
	},
	deleteOption: {
		color: "red",
	},
	modalCancel: {
		fontSize: 16,
		color: "gray",
		marginTop: 10,
	},
});

export default AllNotesScreen;
