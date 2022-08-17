import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostApproved from './posts/PostApproved'
import PostPending from './posts/PostPending'
import PostRejected from './posts/PostRejected'
import PostSold from './posts/PostSold'
import colors from '../constants/colors';
import fonts from '../constants/fonts';

const Tab = createMaterialTopTabNavigator();

const screenOptions = {
    tabBarIndicatorStyle: {
        backgroundColor: colors.primary
    },
    tabBarStyle: {
        backgroundColor: colors.primaryBackground,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: 'black',
    tabBarLabelStyle: {
        fontFamily: fonts.normal,
        fontSize: 13
    }
}

const TopTabBar = ({ routeName }) => {
    return (
        <Tab.Navigator initialRouteName={routeName} screenOptions={screenOptions}>
            <Tab.Screen name="Pending" component={PostPending} />
            <Tab.Screen name="Approved" component={PostApproved} />
            <Tab.Screen name="Rejected" component={PostRejected} />
            <Tab.Screen name="Sold" component={PostSold} />
        </Tab.Navigator>
    )
}

export default TopTabBar

const styles = StyleSheet.create({})