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
import BuyScreen from './screens/BuyScreen';
import ListAddressesScreen from './screens/ListAddressesScreen';
import AddNewAddressScreen from './screens/AddNewAddressScreen';
import PostOrdering from './components/posts/PostOrdering';
import NotificationScreen from './screens/NotificationScreen';
import UpdateUserInfoScreen from './screens/UpdateUserInfoScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import FavouritePostsScreen from './screens/FavouritePostsScreen';
import ProductsSellScreen from './screens/ProductsSellScreen';
import ProductsBuyScreen from './screens/ProductsBuyScreen';
import MoreScreen from './screens/MoreScreen';
import SearchResultScreen from './screens/SearchResultScreen';
import ActivitieNotify from './components/notification/ActivitieNotify';
import messaging from '@react-native-firebase/messaging';


const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerShown: false
}

export default function App() {

  const [initialRoute, setInitialRoute] = useState('Home');

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = () => {
    const user = firebase.auth().currentUser
    if (user != null) {
      const uid = user.uid
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
    }

  };

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });

      messaging().onMessage(async remoteMessage =>{
        console.log('asdas', remoteMessage)
      })
  }, []);

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
        <Stack.Screen name='Buy' component={BuyScreen} />
        <Stack.Screen name='ListAddresses' component={ListAddressesScreen} />
        <Stack.Screen name='AddNewAddress' component={AddNewAddressScreen} />
        <Stack.Screen name='Ordering' component={PostOrdering} />
        <Stack.Screen name='Notify' component={NotificationScreen} />
        <Stack.Screen name='UpdateUser' component={UpdateUserInfoScreen} />
        <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
        <Stack.Screen name='FavouritePosts' component={FavouritePostsScreen} />
        <Stack.Screen name='ProductsSell' component={ProductsSellScreen} />
        <Stack.Screen name='ProductsBuy' component={ProductsBuyScreen} />
        <Stack.Screen name='MoreScreen' component={MoreScreen} />
        <Stack.Screen name='SearchResult' component={SearchResultScreen} />
        <Stack.Screen name='ActivitiveNotify' component={ActivitieNotify} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
