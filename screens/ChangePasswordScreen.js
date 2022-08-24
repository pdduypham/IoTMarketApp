import { Alert, Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import { Button, Card, Input } from 'react-native-elements'
import firebase from '@react-native-firebase/app'

const ChangePasswordScreen = ({ navigation }) => {

    const curUserInfo = firebase.auth().currentUser
    const [curPassword, setCurPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const [hide, setHide] = useState(true)

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    })

    //Update Password
    const updatePassword = async () => {
        const authCredential = firebase.auth.EmailAuthProvider.credential(curUserInfo.email, curPassword)
        curPassword != '' && await firebase.auth().currentUser.reauthenticateWithCredential(authCredential)
            .then(() => {
                newPassword == reNewPassword &&
                    curUserInfo.updatePassword(reNewPassword)
                        .then(() => {
                            Alert.alert('Success', 'Your password is updated.', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.goBack()
                                    }
                                }
                            ])
                        })
            })
            .catch(() => {
                Alert.alert('Update Failed', 'Your current password is not correct.')
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <Card containerStyle={styles.cardContainer}>
                    <Input
                        placeholder='Current Password'
                        label='Current Password'
                        onChangeText={(text) => setCurPassword(text)}
                        renderErrorMessage={curPassword == '' ? true : false}
                        errorMessage='This field must not empty.'
                        errorStyle={{
                            display: curPassword == '' ? 'flex' : 'none'
                        }}
                        inputContainerStyle={{
                            paddingLeft: 10,
                            borderWidth: 2,
                            borderColor: colors.primaryBackground,
                            borderRadius: 10,
                        }}
                        secureTextEntry={hide}
                        rightIcon={
                            <TouchableOpacity onPress={() => setHide(!hide)}>
                                <Image source={hide ? require('../assets/hide.png') : require('../assets/show.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginRight: 5
                                    }}
                                />
                            </TouchableOpacity>
                        }
                    />

                    <Input
                        placeholder='New Password'
                        label='New Password'
                        onChangeText={(text) => setNewPassword(text)}
                        renderErrorMessage={newPassword == '' ? true : false}
                        errorMessage='This field must not empty.'
                        errorStyle={{
                            display: newPassword == '' ? 'flex' : 'none'
                        }}
                        inputContainerStyle={{
                            paddingLeft: 10,
                            borderWidth: 2,
                            borderColor: colors.primaryBackground,
                            borderRadius: 10,
                        }}
                        secureTextEntry={hide}
                    />

                    <Input
                        placeholder='Re-type New Password'
                        label='Re-type New Password'
                        secureTextEntry={hide}
                        onChangeText={(text) => setReNewPassword(text)}
                        renderErrorMessage={reNewPassword == '' ? true : false}
                        errorMessage='This field must not empty.'
                        errorStyle={{
                            display: reNewPassword == '' ? 'flex' : 'none'
                        }}
                        inputContainerStyle={{
                            paddingLeft: 10,
                            borderWidth: 2,
                            borderColor: colors.primaryBackground,
                            borderRadius: 10,
                        }}
                    />
                </Card>
                <Button title='Update'
                    onPress={updatePassword}
                    containerStyle={styles.button}
                    buttonStyle={{
                        height: 50,
                    }}
                    disabled={curPassword != '' && newPassword != '' && reNewPassword != '' ? false : true}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChangePasswordScreen

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
        marginBottom: 100,
        borderRadius: 10,
        marginTop: 20
    }
})