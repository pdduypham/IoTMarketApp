import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ViewHide = () => {
    return (
        <View style={styles.container}>

        </View>
    )
}

export default ViewHide

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
    }
})