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
import BottomMenu from './components/BottomMenu';
import ChatsScreen from './screens/ChatsScreen';
import UpdateScreen from './screens/UpdateScreen';
import PostPending from './components/posts/PostPending';
import PostsScreen from './screens/PostsScreen';


const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerShown: false
}

export default function App() {

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = () => {
    const uid = firebase.auth().currentUser.uid
    if (uid != null) {
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
        <Stack.Screen name='PostDetail' component={PostDetail} />
        <Stack.Screen name='BottomMenu' component={BottomMenu} />
        <Stack.Screen name='Chats' component={ChatsScreen} />
        <Stack.Screen name='Update' component={UpdateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
