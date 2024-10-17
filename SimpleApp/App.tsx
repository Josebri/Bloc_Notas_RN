import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "./src/context/ThemeContext";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import AllNotesScreen from "./src/screens/AllNotesScreen";
import FavoriteNotesScreen from "./src/screens/FavoriteNotesScreen";
import CreateNoteScreen from "./src/screens/CreateNoteScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	AllNotes: undefined;
	FavoriteNotes: undefined;
	CreateNote: undefined;
	UserProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<ThemeProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
					<Stack.Screen name="AllNotes" component={AllNotesScreen} />
					<Stack.Screen name="FavoriteNotes" component={FavoriteNotesScreen} />
					<Stack.Screen name="CreateNote" component={CreateNoteScreen} options={{ title: "Create Note" }} />
					<Stack.Screen name="UserProfile" component={UserProfileScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);
}
