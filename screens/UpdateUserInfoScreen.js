import { Alert, Image, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Card, Input } from 'react-native-elements'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import firebase from '@react-native-firebase/app'
import colors from '../constants/colors'
import { KeyboardAvoidingView } from 'react-native'
import fonts from '../constants/fonts'
import ImagePicker from 'react-native-image-crop-picker';

const UpdateUserInfoScreen = ({ navigation }) => {

    const curUserInfo = firebase.auth().currentUser
    const [fullName, setFullName] = useState(curUserInfo.displayName)
    const [phoneNumber, setPhoneNumber] = useState('0')
    const [gender, setGender] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState([])
    const [change, setChange] = useState(false)
    const [changeName, setChangeName] = useState(false)
    const [changePhone, setChangePhone] = useState(false)
    const [changeAvatar, setChangeAvatar] = useState(false)
    const [imageURL, setImageURL] = useState(curUserInfo.photoURL)

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            },
        })
    })

    //Listen Realtime Update User
    useEffect(() => {
        const getUser = () => {
            firebase.firestore()
                .collection('users')
                .doc(curUserInfo.uid)
                .onSnapshot((snapshot) => {
                    setUser(snapshot.data())
                })
        }
        getUser()
    }, [])

    //Get User once
    useEffect(() => {
        const getUserOnce = async () => {
            await firebase.firestore()
                .collection('users')
                .doc(curUserInfo.uid)
                .get()
                .then((user) => {
                    setPhoneNumber(user.data().phoneNumber)
                })
        }

        getUserOnce()
    }, [navigation])

    //Pick Image from Camera.
    const pickImages = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then(item => {
            setImageURL(item.path)
            setChangeAvatar(true)
        });
    }

    //Logout
    const logoutFunction = async () => {
        Alert.alert('Confirm', 'Do you want to log out?', [
            {
                text: 'Cancel'
            },

            {
                text: 'Yes',
                onPress: async () => {
                    await firebase.firestore()
                        .collection('users')
                        .doc(curUserInfo.uid)
                        .update({
                            onlineStatus: firebase.firestore.Timestamp.now().seconds
                        })
                        .then(() => {
                            firebase.auth()
                                .signOut()
                                .then(() => {
                                    navigation.navigate('Login')
                                })
                        })
                }
            },
        ])
    }

    //Update Gender
    const updateGender = (data) => {
        setModalVisible(false)
        setGender(data)
    }

    const setGenderToDB = async () => {
        await firebase.firestore()
            .collection('users')
            .doc(curUserInfo.uid)
            .update({
                gender: gender
            })

        setGender('')
    }

    //Update Name
    const updateName = async () => {
        await curUserInfo.updateProfile({
            displayName: fullName,
        })
            .then(() => {
                firebase.firestore()
                    .collection('users')
                    .doc(curUserInfo.uid)
                    .update({
                        displayName: fullName
                    })
            })

        setChangeName(false)
    }

    //Update Phone Number
    const updatePhoneNumber = async () => {
        await firebase.firestore()
            .collection('users')
            .doc(curUserInfo.uid)
            .update({
                phoneNumber: phoneNumber
            })

        setChangePhone(false)
    }

    //Update Avatar
    const updateAvatar = async () => {
        await curUserInfo.updateProfile({
            photoURL: imageURL
        })

        setChangeAvatar(false)
    }

    //Disable Button Update
    useEffect(() => {
        if (changeAvatar || changeName || changePhone || (gender != '' && gender != user.gender)) {
            setChange(true)
        } else {
            setChange(false)
        }
    }, [changeName, changePhone, gender, changeAvatar])

    const updateInfo = () => {
        changeName && updateName()
        changePhone && updatePhoneNumber()
        gender != '' && setGenderToDB()
        changeAvatar && updateAvatar()
        Alert.alert('Success', 'Your information is updated!')
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback
                style={{
                    flex: 1,
                }}
                onPress={() => Keyboard.dismiss()}
                accessible={false}
            >
                <KeyboardAvoidingView style={{
                    flex: 1
                }}>
                    <Card containerStyle={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity onPress={pickImages}>
                                <Avatar rounded
                                    size={80}
                                    source={imageURL == null ? require('../assets/logo.jpg') : { uri: imageURL }}
                                    avatarStyle={{
                                        borderWidth: 1,
                                        borderColor: colors.primaryBackground,
                                        zIndex: 1
                                    }} />
                                <Image source={require('../assets/camera.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 24,
                                        height: 24,
                                        zIndex: 0,
                                        position: 'absolute',
                                        top: 55,
                                        left: 55,
                                    }}
                                />
                            </TouchableOpacity>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                            }}>
                                <Input
                                    placeholder='Full Name'
                                    label='Full Name'
                                    defaultValue={user.displayName}
                                    onChangeText={(text) => {
                                        setFullName(text)
                                        text != user.displayName ? setChangeName(true) : setChangeName(false)
                                    }}
                                    renderErrorMessage={fullName == '' ? true : false}
                                    errorMessage='This field must not empty.'
                                    errorStyle={{
                                        display: fullName == '' ? 'flex' : 'none'
                                    }}
                                    rightIcon={<Image source={require('../assets/edit.png')}
                                        resizeMethod='resize'
                                        resizeMode='contain'
                                        style={{
                                            width: 24,
                                            height: 24
                                        }}
                                    />}
                                    inputContainerStyle={{
                                        paddingLeft: 10,
                                        borderWidth: 2,
                                        borderColor: colors.primaryBackground,
                                        borderRadius: 10,
                                    }}
                                />

                                <Input
                                    placeholder='Phone Number'
                                    label='Phone Number'
                                    defaultValue={user.phoneNumber}
                                    onChangeText={(text) => {
                                        setPhoneNumber(text)
                                        text != user.phoneNumber ? setChangePhone(true) : setChangePhone(false)
                                    }}
                                    renderErrorMessage={phoneNumber == '' || !/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(phoneNumber) ? true : false}
                                    errorMessage='This field must not empty and have valid phone number.'
                                    errorStyle={{
                                        display: phoneNumber == '' || !/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(phoneNumber) ? 'flex' : 'none'
                                    }}
                                    rightIcon={<Image source={require('../assets/edit.png')}
                                        resizeMethod='resize'
                                        resizeMode='contain'
                                        style={{
                                            width: 24,
                                            height: 24
                                        }}
                                    />}
                                    inputContainerStyle={{
                                        paddingLeft: 10,
                                        borderWidth: 2,
                                        borderColor: colors.primaryBackground,
                                        borderRadius: 10,
                                    }}
                                    containerStyle={{
                                        marginTop: 10
                                    }}
                                />
                            </View>
                        </View>
                    </Card>

                    <Card containerStyle={{
                        ...styles.cardContainer,
                        marginTop: 5,
                    }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ChangePassword')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 10
                            }}>
                            <Image source={require('../assets/key.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: 'black'
                                }} />
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16,
                                marginLeft: 20
                            }}>Change Password</Text>
                            <View style={{
                                flex: 1
                            }} />
                            <Image source={require('../assets/next.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                        </TouchableOpacity>
                    </Card>

                    <Card containerStyle={{
                        ...styles.cardContainer,
                        marginTop: 5
                    }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                            <Image source={require('../assets/gender.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: 'black',
                                    marginRight: 20
                                }}
                            />
                            <View>
                                <Text style={{
                                    fontFamily: fonts.bold,
                                    fontSize: 16
                                }}>Gender</Text>
                                {gender == '' ?
                                    <Text>{user.gender}</Text>
                                    : <Text>{gender}</Text>}
                            </View>
                            <View style={{
                                flex: 1
                            }} />
                            <Image source={require('../assets/next.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                        </TouchableOpacity>
                    </Card>

                    <Card containerStyle={styles.cardContainer}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 10
                            }}
                            onPress={logoutFunction}>
                            <Image source={require('../assets/logout.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: 'black'
                                }} />
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16,
                                marginLeft: 20
                            }}>Sign Out</Text>
                        </TouchableOpacity>
                    </Card>

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={modalVisible}>
                        <View style={{
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: '40%',
                            padding: 10,
                            width: '70%',
                            alignSelf: 'center',
                            borderRadius: 10,
                            borderColor: colors.primaryBackground,
                            borderWidth: 2
                        }}>
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16,
                                marginBottom: 10
                            }}>Please choose your gender.</Text>

                            <TouchableOpacity onPress={() => updateGender('Male')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingBottom: 5,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'black',
                                    marginBottom: 5
                                }}
                            >
                                <Image source={user.gender == 'Male' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
                                <Text style={{
                                    fontFamily: fonts.normal,
                                    marginLeft: 40
                                }}>Male</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => updateGender('Female')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    paddingBottom: 5,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'black',
                                }}>
                                <Image source={user.gender == 'Female' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
                                <Text style={{
                                    fontFamily: fonts.normal,
                                    marginLeft: 40
                                }}>Female</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => updateGender('Other')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image source={user.gender == 'Other' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
                                <Text style={{
                                    fontFamily: fonts.normal,
                                    marginLeft: 40
                                }}>Other</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <View style={{
                        flex: 1
                    }} />

                    <Button title='Update'
                        onPress={updateInfo}
                        containerStyle={styles.button}
                        buttonStyle={{
                            height: 50,
                        }}
                        disabled={change ? false : true}
                    />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView >

    )
}

export default UpdateUserInfoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 5
    },

    cardContainer: {
        borderRadius: 10,
        marginHorizontal: 0,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },

    button: {
        width: 200,
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20
    }
})