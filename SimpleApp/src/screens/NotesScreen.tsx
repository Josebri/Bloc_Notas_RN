// NotesScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NotesScreen: React.FC = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<Text>Welcome to Notes</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default NotesScreen;
