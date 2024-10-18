import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
	return (
		<View style={styles.searchContainer}>
			<Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
			<TextInput style={styles.searchInput} placeholder="Buscar notas..." value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={onSearch} />
		</View>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingHorizontal: 10,
		margin: 10,
		elevation: 3,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 2,
	},
	searchInput: {
		flex: 1,
		padding: 10,
		fontSize: 16,
		color: "#333",
	},
	searchIcon: {
		marginRight: 10,
	},
});

export default SearchBar;
