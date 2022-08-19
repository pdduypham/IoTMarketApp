import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import fonts from '../constants/fonts'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'

const BuyScreen = ({ navigation, route }) => {

    const [address, setAddress] = useState([])
    const curUser = firebase.auth().currentUser.uid

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Confirm Order',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    })

    //Fetch Receiver's Address
    useEffect(() => {
        const fetchAddress = async () => {
            await firebase.firestore()
                .collection('users')
                .doc(curUser)
                .collection('receiveAddress')
                .get()
                .then((addresses) => {
                    setAddress(addresses.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data()
                    })))
                })
        }
        fetchAddress()
    }, [route, navigation])

    const chooseAddress = () => {
        navigation.navigate('ListAddresses')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Card containerStyle={styles.cardContainer}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image source={require('../assets/address.png')}
                        resizeMethod='resize'
                        resizeMode='contain'
                        style={{
                            width: 24,
                            height: 24,
                            marginRight: 5
                        }} />
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 16
                    }}>Receiver's Address</Text>
                    <View style={{
                        flex: 1
                    }} />
                    <TouchableOpacity>
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 16,
                            color: colors.primary
                        }}>Change</Text>
                    </TouchableOpacity>
                </View>
                {address.length == 0 ?
                    <TouchableOpacity
                        onPress={chooseAddress}
                        style={{
                            borderRadius: 10,
                            borderColor: 'orange',
                            borderWidth: 1,
                            marginTop: 10,
                            padding: 10,
                        }}>
                        <Text style={{
                            alignSelf: 'center',
                            fontFamily: fonts.normal,
                            color: 'orange'
                        }}>Choose Address</Text>
                    </TouchableOpacity>
                    : <View>
                    </View>}
            </Card>
        </SafeAreaView>
    )
}

export default BuyScreen

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        backgroundColor: 'white'
    },
    cardContainer: {
        borderRadius: 10,
        marginHorizontal: 0,
        paddingLeft: 5,
        paddingRight: 5
    }
})