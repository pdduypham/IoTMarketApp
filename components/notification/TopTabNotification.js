import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import ActivitieNotify from './ActivitieNotify';
import SystemNotify from './SystemNotify';

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
const TopTabNotification = () => {
    return (
        <Tab.Navigator initialRouteName='Activitive' screenOptions={screenOptions}>
            <Tab.Screen name="Activitive" component={ActivitieNotify} />
            <Tab.Screen name="System" component={SystemNotify} />
        </Tab.Navigator>
    )
}

export default TopTabNotification

const styles = StyleSheet.create({})