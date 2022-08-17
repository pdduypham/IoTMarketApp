import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import fonts from '../../constants/fonts'
import firebase from '@react-native-firebase/app'
import colors from '../../constants/colors'

const PostItemHorizontal = ({ data, onPress }) => {

    const [time, setTime] = useState('')
    const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')
    const [totalImages, setTotalImages] = useState(0)

    //Convert time
    useEffect(() => {
        let temp = (firebase.firestore.Timestamp.now().seconds - data.postTimestamp)
        if (temp < 120) {
            setTime('Just now')
        } else if (temp >= 120 && (temp / 60 / 60) < 1) {
            setTime((temp / 60).toFixed(0) + ' minutes ago')
        } else if ((temp / 60 / 60) >= 1 && (temp / 60 / 60) < 2) {
            setTime('1 hour ago')
        } else if ((temp / 60 / 60) >= 2 && (temp / 60 / 60 / 24) < 1) {
            setTime((temp / 60 / 60).toFixed(0) + ' hours ago')
        } else if ((temp / 60 / 60 / 24) >= 1 && (temp / 60 / 60 / 24) < 2) {
            setTime('1 day ago')
        } else {
            setTime((temp / 60 / 60 / 24).toFixed(0) + ' days ago')
        }
    })

    //Get Image
    useEffect(() => {
        if (data.postImages == 'No image') {
            setImageURL(require('../../assets/logo.jpg'))
            setTotalImages(0)
        } else {
            const fetchImages = async () => {
                const storageRef = await firebase.storage().ref(data.postImages).listAll()
                storageRef.items.pop().getDownloadURL().then((url) => {
                    setImageURL(url)
                    setTotalImages(storageRef.items.length + 1)
                })
            }
            fetchImages()
        }
    }, [])

    useLayoutEffect(() => {

    })

    return (
        <TouchableOpacity onPress={() => onPress(data)}>
            <Card containerStyle={styles.cardContainer}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Image source={require('../../assets/camera_mini.png')}
                        style={{
                            width: 32,
                            height: 32,
                            position: 'absolute',
                            top: 5,
                            left: 10,
                            zIndex: 1,
                        }}
                        resizeMethod='resize'
                        resizeMode='contain' />
                    <Text style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 12,
                        left: 22,
                        color: 'white',
                        fontFamily: fonts.bold,
                    }}>{totalImages}</Text>
                    <Image source={data.postImages == 'No image' ? imageURL : { uri: imageURL }}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 10,
                            borderColor: colors.primaryBackground,
                            borderWidth: 1
                        }} />
                    <View style={{
                        marginLeft: 5,
                        marginRight: 5,
                        flex: 1
                    }}>
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 18
                        }}>{data.postTitle}</Text>
                        <Text style={{
                            fontFamily: fonts.normal,
                            fontSize: 16,
                            color: 'red'
                        }}>{data.postPrice} đ</Text>
                        {data.postStatus == 2 && <Text
                            numberOfLines={3}
                            ellipsizeMode='tail'
                            style={{
                                fontFamily: fonts.light,
                                color: 'red'
                            }}>Reason: {data.postReason}</Text>}
                        <View style={{
                            flex: 1
                        }} />
                        <View>
                            <Text style={{
                                fontFamily: fonts.light,
                                fontSize: 12,
                                marginBottom: 5,
                            }}>{time}</Text></View>
                    </View>

                </View>
            </Card>
        </TouchableOpacity>
    )
}

export default PostItemHorizontal

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        padding: 0
    }
})