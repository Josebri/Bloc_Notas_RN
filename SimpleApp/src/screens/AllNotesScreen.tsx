import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BottomBar from "../components/BottomBar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

// Definimos el tipo de navegación
type AllNotesScreenNavigationProp = StackNavigationProp<RootStackParamList, "AllNotes">;

const AllNotesScreen: React.FC = () => {
	const navigation = useNavigation<AllNotesScreenNavigationProp>();

	// Configuramos el botón "+" en la barra superior
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => navigation.navigate("CreateNote")}>
					<Icon name="add-outline" size={30} color="#000" style={styles.addButton} />
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Text>All Notes Screen</Text>
			{/* Barra de navegación inferior */}
			<BottomBar />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
	},
	addButton: {
		marginRight: 15,
	},
});

export default AllNotesScreen;
