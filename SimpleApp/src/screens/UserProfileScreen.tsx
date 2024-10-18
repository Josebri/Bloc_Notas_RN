import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const UserProfileScreen: React.FC = () => {
	const [userData, setUserData] = useState<{ first_name: string; last_name: string; email: string; username: string } | null>(null);
	const { isDarkMode, toggleTheme } = useTheme(); // Usar el contexto del tema
	const navigation = useNavigation();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = await AsyncStorage.getItem("token");
				if (token) {
					const response = await fetch("http://192.168.0.114:5000/auth/profile", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`, // Enviamos el token en el encabezado
						},
					});

					if (response.ok) {
						const data = await response.json();
						setUserData(data); // Guardamos los datos del usuario
					} else {
						console.log("Error al obtener los datos del perfil");
					}
				}
			} catch (error) {
				console.log("Error de red", error);
			}
		};

		fetchUserData();
	}, []);

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to log out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					await AsyncStorage.removeItem("token"); // Elimina el token
					navigation.navigate("Login"); // Navega de vuelta al login después de cerrar sesión
				},
			},
		]);
	};

	const handleDeleteAccount = async () => {
		Alert.alert("Delete Account", "Are you sure you want to delete your account?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						const token = await AsyncStorage.getItem("token");
						if (token) {
							const response = await fetch("http://192.168.0.114:5000/auth/delete", {
								method: "DELETE",
								headers: {
									Authorization: `Bearer ${token}`, // Enviamos el token en el encabezado
								},
							});

							if (response.ok) {
								await AsyncStorage.removeItem("token"); // Elimina el token después de eliminar la cuenta
								navigation.navigate("Login"); // Redirige al login
							} else {
								console.log("Error al eliminar la cuenta");
							}
						}
					} catch (error) {
						console.log("Error de red", error);
					}
				},
			},
		]);
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<Text style={[styles.header, { color: isDarkMode ? "#fff" : "#000" }]}>User Profile</Text>
			{userData ? (
				<>
					<Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#000" }]}>First Name: {userData.first_name}</Text>
					<Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#000" }]}>Last Name: {userData.last_name}</Text>
					<Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#000" }]}>Email: {userData.email}</Text>
					<Text style={[styles.text, { color: isDarkMode ? "#ccc" : "#000" }]}>Username: {userData.username}</Text>
				</>
			) : (
				<Text>Loading...</Text>
			)}

			{/* Toggle para el modo nocturno */}
			<View style={styles.switchContainer}>
				<Text style={{ color: isDarkMode ? "#fff" : "#000" }}>Dark Mode</Text>
				<Switch value={isDarkMode} onValueChange={toggleTheme} />
			</View>

			<TouchableOpacity style={styles.button} onPress={handleLogout}>
				<Text style={styles.buttonText}>Logout</Text>
			</TouchableOpacity>

			{/* Botón para eliminar la cuenta */}
			<TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteAccount}>
				<Text style={styles.buttonText}>Delete Account</Text>
			</TouchableOpacity>

			{/* Barra de navegación inferior */}
			<BottomBar />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	text: {
		marginVertical: 5,
	},
	button: {
		backgroundColor: "#3498db",
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 10,
	},
	buttonDelete: {
		backgroundColor: "#e74c3c",
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 20,
	},
});

export default UserProfileScreen;
