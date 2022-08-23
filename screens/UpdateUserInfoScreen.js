import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Card, Input } from 'react-native-elements'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import firebase from '@react-native-firebase/app'
import colors from '../constants/colors'
import { KeyboardAvoidingView } from 'react-native'

const UpdateUserInfoScreen = ({ navigation }) => {

    const curUserInfo = firebase.auth().currentUser
    const [fullName, setFullName] = useState(curUserInfo.displayName)

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <Card containerStyle={styles.cardContainer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
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
                                    left: 55
                                }}
                            />
                        </TouchableOpacity>
                        <Input
                            containerStyle={{
                                flex: 1
                            }}
                            placeholder='Full Name'
                            label='Full Name'
                            defaultValue={curUserInfo.displayName}
                            onChangeText={(text) => setFullName(text)}
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
                        />
                    </View>
                </Card>
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
        paddingVertical: 10
    },
})