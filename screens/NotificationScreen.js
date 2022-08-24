import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import TopTabNotification from '../components/notification/TopTabNotification'
import colors from '../constants/colors'

const NotificationScreen = ({ navigation }) => {

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    })

    return (
        <SafeAreaView style={styles.container}>
            <TopTabNotification />
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})