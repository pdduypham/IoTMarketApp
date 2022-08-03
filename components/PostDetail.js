import { ScrollView, StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

const PostDetail = ({ navigation, route }) => {

    const [listImages, setListImages] = useState([])

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

    useEffect(() => {
        const fetchImages = async () => {
            if (route.params.postImages != 'No image') {
                const imageRef = await firebase.storage().ref(route.params.postImages).listAll()
                const urls = await Promise.all(imageRef.items.map(ref => ref.getDownloadURL()))
                return urls
            } else {
                console.log('blo')
            }
        }

        const loadImages = async () => {
            const urls = await fetchImages();
            setListImages(urls);
        }
        loadImages();
    }, [route])

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

            {route.params.postImages != 'No image'
                && <ScrollView horizontal>
                    {listImages.map((item, index) =>
                        <View key={index} style={{
                            width: Dimensions.get('window').width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 20,
                            paddingRight: 35
                        }}>
                            <Image source={{ uri: item }}
                                style={{
                                    width: '100%',
                                    height: 300,
                                }}
                                resizeMethod='resize'
                                resizeMode='contain'
                            />
                        </View>
                    )}
                </ScrollView>}
            <View>
                <Avatar rounded size={50}
                    source={require('../assets/logo.jpg')} />

            </View>
            <Text >{route.params.postDisplayName}</Text>
        </View>

    )
}

export default PostDetail

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 10
    }
})