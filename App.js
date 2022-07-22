import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import TabBar from './components/TabBar';
import colors from './constants/colors';


const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTitleStyle: { color: "white" },
  hearderTintColor: "white",
  headerTitleAlign: 'center'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalSreenOptions}
        initialRouteName='TabBar'
      >
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='TabBar' component={TabBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
