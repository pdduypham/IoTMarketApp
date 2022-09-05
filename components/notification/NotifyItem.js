import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import fonts from '../../constants/fonts'

const NotifyItem = ({ navigation, data }) => {

    const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')

    //Get Image
    useEffect(() => {
        if (data.postImages == 'No image') {
            setImageURL(require('../../assets/logo.jpg'))
        } else {
            const fetchImages = async () => {
                const storageRef = await firebase.storage().ref(data.postImages).listAll()
                storageRef.items.pop().getDownloadURL().then((url) => {
                    setImageURL(url)
                })
            }
            fetchImages()
        }
    }, [])

    const readNotify = () => {
        navigation.navigate('ProductsSell')
    }

    return (
        <Card containerStyle={{
            ...styles.cardContainer,
            marginTop: 0,
            backgroundColor: !data.notifyStatus ? '#FFF8DC' : 'white',
        }}>
            <TouchableOpacity onPress={readNotify}>
                <View style={{
                    flexDirection: 'row'
                }} >
                    <Image
                        source={data.postImages == 'No image' ? imageURL : { uri: imageURL }}
                        resizeMethod='resize'
                        resizeMode='contain'
                        style={{
                            width: 100,
                            height: 70,
                            borderRadius: 10,
                            marginTop: 5,
                            marginRight: 5
                        }} />
                    <View style={{
                        flexDirection: 'column',
                        flex: 1
                    }}>
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 16
                        }}>{data.postTitle}</Text>
                        <Text>{data.buyerDisplayName} have {data.paymentType ? 'paid' : 'deposited'} for your product. Please check order.</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

export default NotifyItem

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 10,
        marginHorizontal: 0,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 0,
        paddingBottom: 5,
        marginBottom: 5,
    },
})