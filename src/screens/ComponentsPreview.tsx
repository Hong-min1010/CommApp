import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "./LandingScreen";
import { StyleSheet } from "react-native";
import SigninScreen from "./SigninScreen";
import SignupScreen from "./SignupScreen";
import MainScreen from "./MainScreen";
import CreatePostScreen from "./CreatePostScreen";
import PostDetailScreen from "./PostDetailScreen";
import EditPostScreen from "./EditPostScreen";

export type RootStackParamList = {
  Landing: undefined;
  Signin: undefined;
  Signup: undefined;
  Main: undefined;
  Create: undefined;
  Detail: undefined;
  Edit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Signin"
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Create" component={CreatePostScreen} />
        <Stack.Screen name="Detail" component={PostDetailScreen} />
        <Stack.Screen name="Edit" component={EditPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
});
