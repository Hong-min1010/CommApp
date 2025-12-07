// App.tsx (루트)

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "./src/screens/LandingScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import MainScreen from "./src/screens/MainScreen";
import CreatePostScreen from "./src/screens/CreatePostScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import EditPostScreen from "./src/screens/EditPostScreen";

// 📱 화면들

// 필요하면 추후 개발용 프리뷰를 이렇게 추가해도 됨
// import ComponentsPreviewScreen from "./src/screens/ComponentsPreview";

export type RootStackParamList = {
  Landing: undefined;
  Signin:
    | {
        toastMessage?: string;
        toastType?: "success" | "error";
      }
    | undefined;
  Signup: undefined;
  Main:
    | {
        toastMessage?: string;
        toastType?: "success" | "error";
      }
    | undefined;
  Create: undefined;
  Detail: { postId: string };
  Edit: {
    postId: string;
    title: string;
    contents: string;
    imageUrl: string | null;
  };
  // Preview?: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Landing"
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
