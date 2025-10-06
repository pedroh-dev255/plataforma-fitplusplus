// App.tsx
import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaProvider,
} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginScreen from "./screens/loginScreen";
import HomeScreen  from "./screens/HomeScreen";
import ProfileScreen from "./screens/profileScreen";
import { validateToken } from "./api/auth";

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("userData");
      if (token && userData) {
        const validUser = await validateToken(token);
        if (validUser) setUser(validUser);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333333ff' }}>
          <Text style={{ color: '#e9e9e9ff', fontSize: 18, marginBottom: 20 }}>Carregando...</Text>
          <ActivityIndicator size="large" color="#e9e9e9ff" />
        </View>
        
      </>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
