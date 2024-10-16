import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AllNotesScreen from "./src/screens/AllNotesScreen";
import FavoriteNotesScreen from "./src/screens/FavoriteNotesScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import CreateNoteScreen from "./src/screens/CreateNoteScreen";

// Definimos el tipo RootStackParamList para las rutas
type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	AllNotes: undefined;
	FavoriteNotes: undefined;
	UserProfile: undefined;
	CreateNote: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
				<Stack.Screen name="AllNotes" component={AllNotesScreen} />
				<Stack.Screen name="FavoriteNotes" component={FavoriteNotesScreen} />
				<Stack.Screen name="UserProfile" component={UserProfileScreen} />
				<Stack.Screen name="CreateNote" component={CreateNoteScreen} options={{ title: "Create Note" }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
