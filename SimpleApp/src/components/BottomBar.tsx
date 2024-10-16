import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const BottomBar: React.FC = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigation.navigate("AllNotes")}>
				<Icon name="home-outline" size={30} color="#000" />
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate("FavoriteNotes")}>
				<Icon name="star-outline" size={30} color="#000" />
			</TouchableOpacity>

			{/* Botón para la pantalla del perfil de usuario */}
			<TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
				<Icon name="person-outline" size={30} color="#000" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 10,
		backgroundColor: "#fff",
	},
});

export default BottomBar;
