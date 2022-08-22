import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Card } from 'react-native-elements'
import fonts from '../constants/fonts'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import { useIsFocused } from '@react-navigation/native'

const BuyScreen = ({ navigation, route }) => {

    const [addresses, setAddresses] = useState([])
    const curUser = firebase.auth().currentUser.uid
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ward, setWard] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const [createAt, setCreateAt] = useState('')
    const isFocused = useIsFocused();
    const [chosenAddress, setChosenAddress] = useState([])
    const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')

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
    }, [])

    //Fetch Receiver's Address
    useEffect(() => {
        const fetchAddress = async () => {
            firebase.firestore()
                .collection('users')
                .doc(curUser)
                .collection('receiveAddresses')
                .get()
                .then((addresses) => {
                    addresses.docs.map((doc) => {
                        if (doc.data().addressType) {
                            setAddresses({
                                id: doc.id,
                                data: doc.data()
                            })
                        }
                    })
                })
        }
        fetchAddress()
    }, [navigation, isFocused])

    useEffect(() => {
        if (addresses.data != undefined) {
            setName(addresses.data.receiverName)
            setPhone(addresses.data.receiverPhoneNumber)
            setAddress(addresses.data.receiverAddress)
            setWard(addresses.data.receiverWard)
            setDistrict(addresses.data.receiverDistrict)
            setProvince(addresses.data.receiverProvince)
            setCreateAt(addresses.data.createAt)
        }
    })

    //Get and Delete image from child component.
    let getData = (childData) => {
        setChosenAddress(childData)
    }

    //Get Image
    useEffect(() => {
        if (route.params.data.postImages == 'No image') {
            setImageURL(require('../assets/logo.jpg'))
        } else {
            const fetchImages = async () => {
                const storageRef = await firebase.storage().ref(route.params.data.postImages).listAll()
                storageRef.items.pop().getDownloadURL().then((url) => {
                    setImageURL(url)
                })
            }
            fetchImages()
        }
    }, [])

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
                        ...styles.textBold,
                        fontSize: 18
                    }}>Receiver's Address</Text>
                    <View style={{
                        flex: 1
                    }} />
                    {addresses.length != 0 && <TouchableOpacity
                        onPress={() => navigation.navigate('ListAddresses', { onPress: getData })}>
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 16,
                            color: colors.primary
                        }}>Change</Text>
                    </TouchableOpacity>}
                </View>

                {chosenAddress[0] == undefined ?
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 29
                        }}>
                            <Text style={{
                                ...styles.textBold,
                                fontSize: 16
                            }}>{name}</Text>
                            <Text> | {phone}</Text>
                        </View>
                        <View style={{
                            paddingLeft: 29
                        }}>
                            <Text>{address}, {ward}, {district}, {province}</Text>
                        </View>
                    </View> :
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 29
                        }}>
                            <Text style={{
                                ...styles.textBold,
                                fontSize: 16
                            }}>{chosenAddress[0].name}</Text>
                            <Text> | {chosenAddress[0].phone}</Text>
                        </View>
                        <View style={{
                            paddingLeft: 29
                        }}>
                            <Text>{chosenAddress[0].address}, {chosenAddress[0].ward}, {chosenAddress[0].district}, {chosenAddress[0].province}</Text>
                        </View>
                    </View>}
                {addresses.length == 0 ?
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ListAddresses')}
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

            <Card containerStyle={{
                ...styles.cardContainer,
                marginTop: 5,
                paddingRight: 5
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Avatar
                        rounded
                        source={require('../assets/logo.jpg')}
                        size={50}
                        avatarStyle={{
                            borderWidth: 1,
                            borderColor: colors.primaryBackground
                        }} />
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 16,
                        paddingLeft: 5
                    }}>{route.params.data.postDisplayName}</Text>
                    <View style={{
                        flex: 1
                    }} />
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.primary,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                    }}>
                        <Image source={require('../assets/chosen_chat.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 5
                            }} />
                        <Text>Chat</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image source={route.params.data.postImages == 'No image' ? imageURL : { uri: imageURL }}
                        resizeMode='contain'
                        resizeMethod='resize'
                        style={{
                            width: 100,
                            height: 70,
                            borderRadius: 10,
                            marginTop: 5,
                            marginRight: 5
                        }} />
                    <View>
                        <Text style={{
                            fontFamily: fonts.bold
                        }}>{route.params.data.postTitle}</Text>
                        <Text style={{
                            fontFamily: fonts.normal,
                            color: 'red'
                        }}>{route.params.data.postPrice} đ</Text>
                    </View>
                </View>
            </Card>

            <Card containerStyle={{
                ...styles.cardContainer,
                marginTop: 5
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image source={require('../assets/payment.png')}
                        resizeMethod='resize'
                        resizeMode='contain'
                        style={{
                            width: 24,
                            height: 24
                        }}
                    />
                    <Text style={{
                        ...styles.textBold,
                        fontSize: 18,
                        marginLeft: 5
                    }}>Payment Amount</Text>
                </View>

                <View>
                    <Card containerStyle={{
                        ...styles.cardContainer,
                        width: '50%',
                        marginTop: 5,
                        borderColor: 'orange',
                        backgroundColor: '#FFE5CC'
                    }}>
                        <TouchableOpacity>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontFamily: fonts.bold,
                                    color: 'orange'
                                }}>Pay</Text>
                                <View style={{
                                    flex: 1
                                }} />
                                <Image source={require('../assets/check.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20
                                    }} />
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
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
    },

    textNormal: {
        fontFamily: fonts.normal
    },

    textBold: {
        fontFamily: fonts.bold
    }
})