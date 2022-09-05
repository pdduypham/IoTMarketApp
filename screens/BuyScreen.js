import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Card } from 'react-native-elements'
import fonts from '../constants/fonts'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import { StackActions, useIsFocused } from '@react-navigation/native'

const BuyScreen = ({ navigation, route }) => {

    const [addresses, setAddresses] = useState([])
    const curUser = firebase.auth().currentUser
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
    const [check, setCheck] = useState(true)
    let despoit = (parseFloat(route.params.data.postPrice) / 10).toFixed(0)
    const [note, setNote] = useState('')
    const [deliveryMethod, setDeliveryMethod] = useState(0)

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
                .doc(curUser.uid)
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

    //Handle Buy Action
    const buyFunction = () => {
        Alert.alert('Confirm', 'Are you sure you want to buy this product?', [
            {
                text: 'Cancel'
            },

            {
                text: 'Yes',
                onPress: async () => {
                    let createAt = firebase.firestore.Timestamp.now().seconds
                    await firebase.firestore()
                        .collection('orders')
                        .doc(route.params.data.postID + '_' + createAt)
                        .set({
                            sellerID: route.params.data.postOwner,
                            buyerID: curUser.uid,
                            createAt: createAt,
                            orderStatus: 0,
                            postID: route.params.data.postID,
                            receiverName: name,
                            receiverPhoneNumber: phone,
                            receiverAddress: address + ', ' + ward + ', ' + district + ', ' + province + '.',
                            paymentType: check,
                            paymentAmount: check ? route.params.data.postPrice : despoit,
                            paymentMethod: 'momo',
                            noteForSeller: note,
                            deliveryMethod: deliveryMethod
                        })
                        .then(async () => {
                            navigation.dispatch(StackActions.popToTop())
                            navigation.navigate('ProductsBuy')
                            await firebase.firestore()
                                .collection('posts')
                                .doc(route.params.data.postID)
                                .update({
                                    postStatus: 4
                                })

                            await firebase.firestore()
                                .collection('users')
                                .doc(route.params.data.postOwner)
                                .collection('notifies')
                                .doc(createAt.toString())
                                .set({
                                    notifyType: true,
                                    notifyStatus: false,
                                    paymentType: check,
                                    buyerID: curUser.uid,
                                    createAt: createAt,
                                    postID: route.params.data.postID,
                                    postTitle: route.params.data.postTitle,
                                    buyerDisplayName: curUser.displayName,
                                    postImages: route.params.data.postImages
                                })
                        })
                }
            },
        ])

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                            }}>CHANGE</Text>
                        </TouchableOpacity>}
                    </View>

                    {chosenAddress[0] == undefined ?
                        <View>
                            {name != '' && <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 29
                            }}>
                                <Text style={{
                                    ...styles.textBold,
                                    fontSize: 16
                                }}>{name}</Text>
                                <Text> | {phone}</Text>
                            </View>}
                            {address != '' && <View style={{
                                paddingLeft: 29
                            }}>
                                <Text>{address}, {ward}, {district}, {province}</Text>
                            </View>}
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
                            source={curUser.photoURL == null ? require('../assets/logo.jpg') : { uri: curUser.photoURL }}
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
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Chats')}
                            style={{
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
                    marginTop: 5,
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

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Card containerStyle={{
                            ...styles.cardContainer,
                            width: '49%',
                            marginTop: 5,
                            borderColor: 'orange',
                            backgroundColor: check ? '#FFE5CC' : 'white',
                            marginRight: 5
                        }}>
                            <TouchableOpacity onPress={() => {
                                !check && setCheck(!check)
                            }}>
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
                                    <Image source={check ? require('../assets/check.png') : require('../assets/uncheck.png')}
                                        resizeMethod='resize'
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20
                                        }} />
                                </View>
                                <Text style={{
                                    fontFamily: fonts.bold,
                                    fontSize: 18
                                }}>{route.params.data.postPrice} đ</Text>
                                <Text>Pay the full amount.</Text>
                            </TouchableOpacity>
                        </Card>

                        <Card containerStyle={{
                            ...styles.cardContainer,
                            width: '49%',
                            marginTop: 5,
                            borderColor: 'orange',
                            backgroundColor: !check ? '#FFE5CC' : 'white'
                        }}>
                            <TouchableOpacity onPress={() => {
                                check && setCheck(!check)
                            }}>
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.bold,
                                        color: 'orange'
                                    }}>Despoit</Text>
                                    <View style={{
                                        flex: 1
                                    }} />
                                    <Image source={!check ? require('../assets/check.png') : require('../assets/uncheck.png')}
                                        resizeMethod='resize'
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20
                                        }} />
                                </View>
                                <Text style={{
                                    fontFamily: fonts.bold,
                                    fontSize: 18
                                }}>{despoit < 50000 ? despoit = 50000 : despoit} đ</Text>
                                <Text>The remaining amount you pay with the seller yourself.</Text>
                            </TouchableOpacity>
                        </Card>
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
                        <Image source={require('../assets/ship.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 5
                            }}
                        />
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 18
                        }}>Delivery Method</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.primaryBackground,
                        padding: 5,
                        marginTop: 5
                    }}>
                        <Image source={require('../assets/return.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 5
                            }}
                        />
                        <Text>Negotiate delivery fee.</Text>
                    </View>
                </Card>

                <Card containerStyle={{
                    ...styles.cardContainer,
                    marginTop: 5
                }}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Image source={require('../assets/payment_method.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 5
                            }}
                        />
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 18
                        }}>Payment Method</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: colors.primaryBackground,
                            padding: 5
                        }}
                    >
                        <Image source={require('../assets/momo.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                marginRight: 5
                            }}
                        />
                        <Text style={{
                            fontFamily: fonts.normal,
                            fontSize: 14
                        }}>Momo Wallet</Text>
                        <View style={{
                            flex: 1
                        }} />
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 16,
                            color: colors.primary
                        }}>CHANGE</Text>
                    </TouchableOpacity>
                </Card>

                <Card containerStyle={{
                    ...styles.cardContainer,
                    marginTop: 5,
                    marginBottom: 20
                }}>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 18
                    }}>Order Information</Text>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Text>Amount: </Text>
                        <View style={{
                            flex: 1
                        }} />
                        <Text>{check ? route.params.data.postPrice : despoit} đ</Text>
                    </View>
                    <View style={{
                        borderWidth: 0.5,
                        width: '90%',
                        borderStyle: 'dashed',
                        marginTop: 10,
                        marginBottom: 10,
                        alignSelf: 'center'
                    }} />
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Text>Total Amount: </Text>
                        <View style={{
                            flex: 1
                        }} />
                        <Text style={{
                            fontFamily: fonts.bold,
                            fontSize: 18
                        }}>{check ? route.params.data.postPrice : despoit} đ</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 5
                    }}>
                        <Image source={require('../assets/note.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                marginRight: 5
                            }}
                        />
                        <Text style={{
                            fontFamily: fonts.bold
                        }}>Note for Seller</Text>
                    </View>
                    <TextInput
                        height={70}
                        multiline
                        placeholder='Note for Seller.'
                        value={note}
                        onChangeText={(text) => setNote(text)}
                        style={{
                            borderColor: colors.primaryBackground,
                            borderWidth: 1,
                            borderRadius: 10,
                            marginTop: 5,
                        }} />

                    <Text>By clicking order, you have read, understood, and agreed </Text>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                    }}>
                        <Text>to </Text>
                        <Text style={{
                            color: colors.primary,
                            borderBottomWidth: 1,
                            borderColor: colors.primary
                        }}>the IOTMarket's Purchase Policy.</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <View style={{
                    flexDirection: 'column',
                    width: '40%',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: fonts.bold
                    }}>TOTAL:</Text>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 26
                    }}>{check ? route.params.data.postPrice : despoit}</Text>
                </View>
                <TouchableOpacity
                    onPress={buyFunction}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60%',
                        backgroundColor: colors.primary,
                        borderRadius: 10,
                        paddingVertical: 5,
                        marginVertical: 10,
                    }}>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 26,
                        color: 'white'
                    }}>ORDER</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default BuyScreen

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        backgroundColor: 'white',
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