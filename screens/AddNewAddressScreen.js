import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import colors from '../constants/colors'

const AddNewAddressScreen = ({ navigation, route }) => {

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Receive Address',
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
            <Text>AddNewAddressScreen</Text>
        </SafeAreaView>
    )
}

export default AddNewAddressScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10
    }
})