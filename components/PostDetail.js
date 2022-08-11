import { ScrollView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import Carousel from 'react-native-anchor-carousel';

const PostDetail = ({ navigation, route }) => {

    const [listImages, setListImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [time, setTime] = useState('')
    const [online, setOnline] = useState(false)

    //Convert time
    useEffect(() => {
        let temp = (firebase.firestore.Timestamp.now().seconds - route.params.postTimestamp) / 60
        if (temp < 60) {
            setTime(temp.toFixed(0) + ' munites ago')
        } else {
            if (temp > 60 && (temp / 60) < 24) {
                setTime((temp / 60).toFixed(0) + ' hours ago')
            } else {
                if ((temp / 60) > 24) {
                    setTime((temp / 60 / 24).toFixed(0) + ' days ago')
                }
            }
        }
    })

    //Navigation header
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

    //Fetch Image
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

    //Check onlineStatus
    useEffect(() => {
        const checkOnlineStatus = async () =>
            await firebase.firestore()
                .collection('users')
                .doc(route.params.postOwner)
                .get()
                .then(data => {
                    setOnline(data.get('onlineStatus'))
                })

        checkOnlineStatus()
    })

    return (
        <View style={styles.container}>
            {loading ? <Image source={require('../assets/logo.jpg')}
                resizeMethod='scale'
                resizeMode='contain'
                style={{
                    width: '100%',
                    height: 300
                }} />
                : <View>
                    <Carousel data={listImages}
                        initialIndex={0}
                        itemWidth={Dimensions.get('window').width * 0.9}
                        separatorWidth={2}
                        inActiveOpacity={0.5}
                        onSnapToItem={index => setIndex(index)}
                        renderItem={({ item }) =>
                            <Image source={{ uri: item }}
                                resizeMethod='scale'
                                resizeMode='contain'
                                style={{
                                    width: '100%',
                                    height: 250,
                                    borderRadius: 10
                                }} />
                        } />
                </View>
            }

            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
            }}>
                <Avatar rounded size={64}
                    source={require('../assets/logo.jpg')}
                    avatarStyle={{
                        borderWidth: 1,
                        borderColor: colors.primaryBackground
                    }}
                />

                {online ? <Image
                    source={require('../assets/online.png')}
                    style={{
                        width: 16,
                        height: 16,
                        position: 'absolute',
                        left: 45,
                        top: 45
                    }} />
                    : <Image source={require('../assets/offline.png')}
                        style={{
                            width: 16,
                            height: 16,
                            position: 'absolute',
                            left: 45,
                            top: 45
                        }} />}

                <View style={{
                    flexDirection: 'column'
                }}>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 16,
                        marginLeft: 5
                    }}>{route.params.postDisplayName}</Text>

                    {online ? <Text
                    style={{
                        marginLeft: 5,
                    }}>Online</Text>
                        : <Text></Text>}
                </View>
            </View>

            <View style={{
                flex: 1
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 20,
                        marginTop: 5
                    }}>{route.params.postTitle}</Text>
                    <View style={{
                        flex: 1
                    }} />
                    <Image source={require('../assets/clock.png')}
                        style={{
                            width: 14,
                            height: 14,
                            marginRight: 5
                        }} />
                    <Text style={{
                        marginRight: 10
                    }}>{time}</Text>
                </View>

                <Text style={{
                    fontFamily: fonts.normal,
                    fontSize: 16,
                    color: 'red'
                }}>{route.params.postPrice} đ</Text>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={styles.textContainer}>Category: </Text>
                    <Text>{route.params.postCategory}</Text>
                </View>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={styles.textContainer}>Branch: </Text>
                    <Text>{route.params.postBranch}</Text>
                </View>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={styles.textContainer}>Status: </Text>
                    <Text>{route.params.postStatusOfProduct}</Text>
                </View>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={styles.textContainer}>Description: </Text>
                    <Text>{route.params.postDescription}</Text>
                </View>
            </View>
        </View>

    )
}

export default PostDetail

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 10,
        flex: 1
    },

    textContainer: {
        fontFamily: fonts.normal
    }
})