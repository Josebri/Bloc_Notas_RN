import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import NotesScreen from "./src/screens/NotesScreen";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Notes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
				<Stack.Screen name="Notes" component={NotesScreen} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
