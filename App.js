import React, { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './screens/SignUpScreen';
import TabBar from './components/TabBar';
import HomeScreen from './screens/HomeScreen';
import PostDetail from './components/PostDetail';
import ImageViewScreen from './screens/ImageViewScreen'
import firebase from '@react-native-firebase/app';


const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerShown: false
}

export default function App() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = () => {
    const uid = firebase.auth().currentUser.uid
    if (AppState.currentState == 'active') {
      firebase.firestore()
        .collection('users')
        .doc(uid)
        .update({
          onlineStatus: 'online'
        })
    } else {
      firebase.firestore()
        .collection('users')
        .doc(uid)
        .update({
          onlineStatus: firebase.firestore.Timestamp.now().seconds
        })
    }
  };



  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalSreenOptions}
        initialRouteName='Login'>
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
