import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const UploadImageItem = (imageURI) => {
    return (
        <View style={styles.container} key={imageURI}>
        {console.log(imageURI.imageURI)}
            <Image source={{uri:imageURI.imageURI}} style={{
                width: 50,
                height: 50
            }} />
        </View>
    )
}

export default UploadImageItem

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        marginRight: 2
    }
})