import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomBar from "../components/BottomBar";

const FavoriteNotesScreen: React.FC = () => {
	return (
		<View style={styles.container}>
			<Text>Favorite Notes Screen</Text>

			{/* Barra de navegación */}
			<BottomBar />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
});

export default FavoriteNotesScreen;
