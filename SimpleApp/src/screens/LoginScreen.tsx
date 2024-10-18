import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	AllNotes: undefined;
	FavoriteNotes: undefined;
	UserProfile: undefined;
};

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
	const [emailOrUsername, setEmailOrUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // Mensaje de error
	const { isDarkMode } = useTheme();

	const handleLogin = async () => {
		setErrorMessage(null); // Reiniciar el mensaje de error antes de intentar iniciar sesión
		try {
			const trimmedEmailOrUsername = emailOrUsername.trim();
			const trimmedPassword = password.trim();

			const response = await fetch("http://192.168.0.114:5000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					emailOrUsername: trimmedEmailOrUsername,
					password: trimmedPassword,
				}),
			});

			const data = await response.json(); // Obtener respuesta del backend

			if (response.ok) {
				// Guarda el token en AsyncStorage
				await AsyncStorage.setItem("token", data.token);
				// Navega a la pantalla de Notas
				navigation.navigate("AllNotes");
			} else {
				// Mostrar el mensaje de error específico
				setErrorMessage(data.error || "Error al iniciar sesión");
			}
		} catch (error) {
			console.log("Error de red", error);
			setErrorMessage("Error de red al intentar iniciar sesión");
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			{/* Mostrar mensaje de error */}
			{errorMessage && <Text style={[styles.errorText, { color: isDarkMode ? "#ff4d4d" : "red" }]}>{errorMessage}</Text>}

			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Username or Email"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={emailOrUsername}
				onChangeText={setEmailOrUsername}
				autoCapitalize="none"
				autoCorrect={false}
				maxLength={60} // Límite de caracteres
			/>
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Password"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				autoCapitalize="none"
				maxLength={60} // Límite de caracteres
			/>
			<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
				<Text style={styles.loginButtonText}>Login</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Register")}>
				<Text style={[styles.registerLink, { color: isDarkMode ? "#80bfff" : "#3897f0" }]}>Go to Register</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	loginButton: {
		backgroundColor: "#3897f0",
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	loginButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	registerLink: {
		marginTop: 20,
		textAlign: "center",
		fontSize: 16,
	},
	errorText: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 16,
	},
});

export default LoginScreen;
