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
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // Mensaje general de error
	const [fieldErrors, setFieldErrors] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	}); // Estado para los mensajes de error por campo

	const { isDarkMode } = useTheme();

	const handleRegister = async () => {
		setFieldErrors({ firstName: "", lastName: "", username: "", email: "", password: "" }); // Reiniciar los errores
		setErrorMessage(null); // Reiniciar el mensaje de error general

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

			const data = await response.json(); // Procesar la respuesta del servidor

			if (response.ok) {
				navigation.navigate("Login"); // Navega al login si el registro fue exitoso
			} else {
				// Procesar errores del backend y asignarlos al estado correspondiente
				if (data.error) {
					setErrorMessage(data.error);
				}
				if (data.errors) {
					const errors = data.errors;
					setFieldErrors({
						firstName: errors.first_name || "",
						lastName: errors.last_name || "",
						username: errors.username || "",
						email: errors.email || "",
						password: errors.password || "",
					});
				}
			}
		} catch (error) {
			// Manejar errores de red
			console.log("Error de red", error);
			setErrorMessage("Error de red al intentar registrarse");
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
			{errorMessage && <Text style={[styles.errorText, { color: isDarkMode ? "#ff4d4d" : "red" }]}>{errorMessage}</Text>}

			{/* Campo First Name */}
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="First Name"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={firstName}
				onChangeText={setFirstName}
				maxLength={60} // Límite de caracteres
			/>
			{fieldErrors.firstName ? <Text style={styles.fieldErrorText}>{fieldErrors.firstName}</Text> : null}

			{/* Campo Last Name */}
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Last Name"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={lastName}
				onChangeText={setLastName}
				maxLength={60} // Límite de caracteres
			/>
			{fieldErrors.lastName ? <Text style={styles.fieldErrorText}>{fieldErrors.lastName}</Text> : null}

			{/* Campo Username */}
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Username"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={username}
				onChangeText={setUsername}
				maxLength={60} // Límite de caracteres
			/>
			{fieldErrors.username ? <Text style={styles.fieldErrorText}>{fieldErrors.username}</Text> : null}

			{/* Campo Email */}
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Email"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				maxLength={60} // Límite de caracteres
			/>
			{fieldErrors.email ? <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text> : null}

			{/* Campo Password */}
			<TextInput
				style={[styles.input, { borderColor: isDarkMode ? "#fff" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
				placeholder="Password"
				placeholderTextColor={isDarkMode ? "#999" : "#666"}
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				maxLength={60} // Límite de caracteres
			/>
			{fieldErrors.password ? <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text> : null}

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
	errorText: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 16,
	},
	fieldErrorText: {
		color: "red",
		marginBottom: 10,
		fontSize: 14,
		marginLeft: 10,
	},
});

export default RegisterScreen;
