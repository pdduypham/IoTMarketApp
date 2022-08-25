import { Alert, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Card, Input } from 'react-native-elements'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import firebase from '@react-native-firebase/app'
import colors from '../constants/colors'
import { KeyboardAvoidingView } from 'react-native'
import fonts from '../constants/fonts'

const UpdateUserInfoScreen = ({ navigation }) => {

    const curUserInfo = firebase.auth().currentUser
    const [fullName, setFullName] = useState(curUserInfo.displayName)
    const [phoneNumber, setPhoneNumber] = useState('0')
    const [gender, setGender] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState([])

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
            headerRight: () => (
                <TouchableOpacity onPress={logoutFunction}>
                    <Image source={require('../assets/logout.png')}
                        resizeMethod='resize'
                        resizeMode='contain'
                        style={{
                            width: 24,
                            height: 24
                        }} />
                </TouchableOpacity>
            )
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
                    console.log(user.data().phoneNumber)
                })
        }

        getUserOnce()
    }, [navigation])

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
    const updateGender = async (data) => {
        setModalVisible(false)
        setGender(data)
        await firebase.firestore()
            .collection('users')
            .doc(curUserInfo.uid)
            .update({
                gender: data
            })
            .then(() => {
                Alert.alert('Update successed.', 'Your gender is updated.')
            })
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
                    .then(() => {
                        Alert.alert('Update successed.', 'Your display name is updated.')
                    })
            })
    }

    //Update Phone Number
    const updatePhoneNumber = async () => {
        await firebase.firestore()
            .collection('users')
            .doc(curUserInfo.uid)
            .update({
                phoneNumber: phoneNumber
            })
            .then(() => {
                Alert.alert('Update successed.', 'Your display name is updated.')
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <Card containerStyle={styles.cardContainer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity>
                            <Avatar rounded
                                size={80}
                                source={require('../assets/logo.jpg')}
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
                                onChangeText={(text) => setFullName(text)}
                                renderErrorMessage={fullName == '' ? true : false}
                                errorMessage='This field must not empty.'
                                errorStyle={{
                                    display: fullName == '' ? 'flex' : 'none'
                                }}
                                rightIcon={user.displayName == fullName ? <Image source={require('../assets/edit.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 24,
                                        height: 24
                                    }}
                                />
                                    : fullName != '' && <TouchableOpacity style={{
                                        backgroundColor: colors.primary,
                                        padding: 5,
                                        borderRadius: 10,
                                    }}
                                        onPress={updateName}
                                    >
                                        <Text style={{
                                            fontFamily: fonts.normal,
                                            color: 'white'
                                        }}>SAVE</Text>
                                    </TouchableOpacity>
                                }
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
                                onChangeText={(text) => setPhoneNumber(text)}
                                renderErrorMessage={phoneNumber == '' ? true : false}
                                errorMessage='This field must not empty.'
                                errorStyle={{
                                    display: phoneNumber == '' ? 'flex' : 'none'
                                }}
                                rightIcon={user.phoneNumber == phoneNumber ? <Image source={require('../assets/edit.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 24,
                                        height: 24
                                    }}
                                />
                                    : phoneNumber != '' && <TouchableOpacity style={{
                                        backgroundColor: colors.primary,
                                        padding: 5,
                                        borderRadius: 10
                                    }}
                                        onPress={updatePhoneNumber}
                                    >
                                        <Text style={{
                                            fontFamily: fonts.normal,
                                            color: 'white'
                                        }}>SAVE</Text>
                                    </TouchableOpacity>
                                }
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
                    marginTop: 5
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChangePassword')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <View>
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16
                            }}>Password</Text>
                            <Text>**********</Text>
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
                        <View>
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16
                            }}>Gender</Text>
                            <Text>{user.gender}</Text>
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
                            <Image source={gender == 'Male' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
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
                            <Image source={gender == 'Female' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
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
                            <Image source={gender == 'Other' ? require('../assets/check.png') : require('../assets/uncheck.png')} />
                            <Text style={{
                                fontFamily: fonts.normal,
                                marginLeft: 40
                            }}>Other</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
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
})