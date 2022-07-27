import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

const UploadImageItem = (props) => {
    let deleteImage = () => {
        props.onPress(props.imageURI)
    }

    return (
        <View style={styles.container} key={props.imageURI}>
            <Image source={{ uri: props.imageURI }} style={{
                width: 100,
                height: 80,
            }} />
            <TouchableOpacity onPress={deleteImage}>
                <Image source={require('../assets/close.png')}
                style={{
                    top: 3,
                    right:20,
                    tintColor: 'white'
                }} />
            </TouchableOpacity>
        </View>
    )
}

export default UploadImageItem

const styles = StyleSheet.create({
    container: {
        margin: 2,
        flex: 1,
        flexDirection: 'row'
    }
})