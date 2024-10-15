import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

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
		<View style={styles.container}>
			<TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
			<TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
			<TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
			<TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
			<TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
			<TouchableOpacity style={styles.button} onPress={handleRegister}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text style={styles.backLink}>Back to Login</Text>
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
		color: "#3897f0",
		textAlign: "center",
		fontSize: 16,
	},
});

export default RegisterScreen;
