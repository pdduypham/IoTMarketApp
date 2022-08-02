import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements'
import  firebase  from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

const PostDetail = ({ navigation, route }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detail',
            headerStyle: { backgroundColor: colors.primary },
            headerTitleStyle: { color: "white" },
            hearderTintColor: "white",
            headerTitleAlign: 'center',
            headerShown: true,
        })
    })

    useEffect(()=> {
        console.log(await firebase.storage().ref(postImages).listAll()
            .items.pop().getDownloadURL().then((url) => {
                url
        }))
    })

    return (
        <View style={styles.container}>
            <Text style={{
                fontFamily: fonts.bold,
                fontSize: 20
            }}>{route.params.postTitle}</Text>
            <Text style={{
                fontFamily: fonts.normal,
                fontSize: 16,
                color: 'red'
            }}>{route.params.postPrice} đ</Text>

            <View>
                <Avatar rounded size={50}
                    source={require('../assets/logo.jpg')} />
                
            </View>
            <Text >{route.params.postImages}</Text>
        </View>

    )
}

export default PostDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 10
    }
})