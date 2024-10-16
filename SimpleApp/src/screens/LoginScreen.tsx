import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

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

	const handleLogin = async () => {
		try {
			const trimmedEmailOrUsername = emailOrUsername.trim(); // Elimina espacios al inicio y al final del username o email
			const trimmedPassword = password.trim(); // Elimina espacios al inicio y al final de la contraseña

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

			if (response.ok) {
				const data = await response.json();
				// Si el login es exitoso, navega a la pantalla de Notas
				navigation.navigate("AllNotes");
			} else {
				const errorData = await response.json();
				console.log("Error al iniciar sesión:", errorData); // Muestra detalles del error
			}
		} catch (error) {
			console.log("Error de red", error); // Captura errores de red
		}
	};

	return (
		<View style={styles.container}>
			<TextInput style={styles.input} placeholder="Username or Email" value={emailOrUsername} onChangeText={setEmailOrUsername} autoCapitalize="none" autoCorrect={false} />
			<TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
			<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
				<Text style={styles.loginButtonText}>Login</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Register")}>
				<Text style={styles.registerLink}>Go to Register</Text>
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
		borderColor: "#ccc",
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
		color: "#3897f0",
		textAlign: "center",
		fontSize: 16,
	},
});

export default LoginScreen;
