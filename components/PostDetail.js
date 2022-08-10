import { ScrollView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import Carousel from 'react-native-anchor-carousel';
import ImageView from 'react-native-image-view';

const PostDetail = ({ navigation, route }) => {

    const [listImages, setListImages] = useState([])
    const [loading, setLoading] = useState(true)

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
            setLoading(false)
        }
        loadImages();
    }, [route])

    return (
        <View style={styles.container}>
            {loading ? <Image source={require('../assets/logo.jpg')}
                resizeMethod='scale'
                resizeMode='contain'
                style={{
                    width: '100%',
                    height: 300
                }} />
                : <ScrollView>
                    <Carousel data={listImages}
                        initialIndex={0}
                        itemWidth={Dimensions.get('window').width * 0.8}
                        separatorWidth={2}
                        inActiveOpacity={0.5}
                        renderItem={({ item }) =>
                            <Image source={{ uri: item }}
                                resizeMethod='scale'
                                resizeMode='contain'
                                style={{
                                    width: '100%',
                                    height: 300,
                                    borderRadius: 10
                                }} />
                        } />
                </ScrollView>}

            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center'
            }}>
                <Avatar rounded size={50}
                    source={require('../assets/logo.jpg')} />
                <Text style={{
                    fontFamily: fonts.bold,
                    fontSize: 16
                }}>{route.params.postDisplayName}</Text>
            </View>

            <Text style={{
                fontFamily: fonts.bold,
                fontSize: 20,
                marginTop: 5
            }}>{route.params.postTitle}</Text>

            <Text style={{
                fontFamily: fonts.normal,
                fontSize: 16,
                color: 'red'
            }}>{route.params.postPrice} đ</Text>

            <View></View>
            <Text>{route.params.postCategory}</Text>
            <Text>{route.params.postBranch}</Text>
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