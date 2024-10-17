import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
};

type Props = StackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { isDarkMode } = useTheme();

	const handleRegister = async () => {
		try {
			const response = await fetch("http://192.168.0.114:5000/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					username,
					email,
					password,
				}),
			});

			if (response.ok) {
				navigation.navigate("Login"); // Navega de vuelta al login
			} else {
				console.log("Error al registrarse");
			}
		} catch (error) {
			console.log("Error de red", error); // Solo lo muestra en consola
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			<TextInput style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]} placeholder="First Name" placeholderTextColor={isDarkMode ? "#999" : "#666"} value={firstName} onChangeText={setFirstName} />
			<TextInput style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Last Name" placeholderTextColor={isDarkMode ? "#999" : "#666"} value={lastName} onChangeText={setLastName} />
			<TextInput style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Username" placeholderTextColor={isDarkMode ? "#999" : "#666"} value={username} onChangeText={setUsername} />
			<TextInput style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Email" placeholderTextColor={isDarkMode ? "#999" : "#666"} value={email} onChangeText={setEmail} keyboardType="email-address" />
			<TextInput style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]} placeholder="Password" placeholderTextColor={isDarkMode ? "#999" : "#666"} value={password} onChangeText={setPassword} secureTextEntry />
			<TouchableOpacity style={styles.button} onPress={handleRegister}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text style={[styles.backLink, { color: isDarkMode ? "#80bfff" : "#3897f0" }]}>Back to Login</Text>
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
	button: {
		backgroundColor: "#3897f0",
		paddingVertical: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
	backLink: {
		marginTop: 20,
		textAlign: "center",
		fontSize: 16,
	},
});

export default RegisterScreen;
