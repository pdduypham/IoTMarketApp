import { StyleSheet, Text, View, Image, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeScreen from '../screens/HomeScreen'
import ChatsScreen from '../screens/ChatsScreen'
import PostsScreen from '../screens/PostsScreen'
import UploadScreen from '../screens/UploadScreen'
import MoreScreen from '../screens/MoreScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import colors from '../constants/colors'
import fonts from '../constants/fonts'

const Tab = createBottomTabNavigator()

const screenOptions = () => ({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primaryBackground,
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',
    ...styles.shadow,
  },
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  headerStyle: { backgroundColor: colors.primary },
  headerTitleStyle: {
    color: "white",
    fontFamily: fonts.bold
  },
  hearderTintColor: "white",
  headerTitleAlign: 'center',
  headerShown: false
})

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={{
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
    ...styles.shadow
  }}
    onPress={onPress}>
    <View style={{
      width: 64,
      height: 64,
      borderRadius: 35,
      marginHorizontal: 5,
      backgroundColor: 'white'
    }}>
      {children}
    </View>
  </TouchableOpacity>
)

const TabBar = ({ route }) => {
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName={route.params.routeName}>
      <Tab.Screen name='Home' component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.viewContainer}>
              <Image source={require('../assets/home.png')}
                resizeMode='contain'
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.primary : 'black',
                }} />
            </View>
          )
        }}
      />
      <Tab.Screen initialParams={{ name: route.params.name }} name='Posts' component={PostsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.viewContainer}>
              <Image source={require('../assets/business.png')}
                resizeMode='contain'
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.primary : 'black'
                }} />
            </View>
          )
        }} />
      <Tab.Screen name='Upload' component={UploadScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={require('../assets/add.png')}
              resizeMode='contain'
              style={{
                width: 64,
                height: 64,
                tintColor: focused ? colors.primary : '#B5D6F0',
              }} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
        }} />
      <Tab.Screen name='Chats' component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.viewContainer}>
              <Image source={require('../assets/chat.png')}
                resizeMode='contain'
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.primary : 'black'
                }} />
            </View>
          )
        }} />
      <Tab.Screen name='More' component={MoreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.viewContainer}>
              <Image source={require('../assets/more.png')}
                resizeMode='contain'
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.primary : 'black'
                }} />
            </View>
          )
        }} />

    </Tab.Navigator>
  )
}

export default TabBar

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  viewContainer: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  hideTabNavigation: {
    display: 'none'
  }
})