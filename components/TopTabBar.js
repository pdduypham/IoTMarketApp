import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostApproved from './posts/PostApproved'
import PostPending from './posts/PostPending'
import PostRejected from './posts/PostRejected'
import PostSold from './posts/PostSold'

const Tab = createMaterialTopTabNavigator();

const screenOptions = {
    title: 'a'
}

const TopTabBar = () => {
    return (
        <Tab.Navigator initialRouteName='PostPending'>
            <Tab.Screen name="Pending" component={PostPending} />
            <Tab.Screen name="Approved" component={PostApproved} />
            <Tab.Screen name="Rejected" component={PostRejected} />
            <Tab.Screen name="Sold" component={PostSold} />
        </Tab.Navigator>
    )
}

export default TopTabBar

const styles = StyleSheet.create({})