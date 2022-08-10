import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import TabBar from './components/TabBar';
import HomeScreen from './screens/HomeScreen';
import PostDetail from './components/PostDetail';
import ImageViewScreen from './screens/ImageViewScreen'


const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  // headerStyle: { backgroundColor: colors.primary },
  // headerTitleStyle: { color: "white" },
  // hearderTintColor: "white",
  // headerTitleAlign: 'center',
  headerShown: false
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalSreenOptions}
        initialRouteName='Login'
      >
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='TabBar' component={TabBar} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='PostDetail' component={PostDetail} />
        <Stack.Screen name='ImageView' component={ImageViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
