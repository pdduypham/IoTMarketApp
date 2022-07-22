import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({ navigation }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')

    const signUp = () => {
        password == rePassword ?
            auth().createUserWithEmailAndPassword(email, password)
                .then((authUser) => {
                    authUser.user.updateProfile({
                        displayName: name,
                    })
                    firestore().collection('users').add({
                        userUID: authUser.user.uid,
                        userIsAdmin: 0
                    })
                        .catch(error => alert(error))
                })
                .catch(error => alert(error.meesage))
            : alert('Password is not match!!!')
    }

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar type='dark' />
            <Image source={require('../assets/logo.jpg')}
                style={{
                    width: 250,
                    height: 250,
                }} />
            <View style={styles.inputContainer}>
                <Input placeholder='Email'
                    value={email}
                    autoFocus
                    onChangeText={(text) => setEmail(text)} />
                <Input placeholder='Full name'
                    value={name}
                    onChangeText={(text) => setName(text)} />
                <Input placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)} />
                <Input placeholder='Retype Password'
                    secureTextEntry
                    value={rePassword}
                    onChangeText={(text) => setRePassword(text)}
                    onSubmitEditing={signUp} />
            </View>
            <Button title={'Sign Up'} containerStyle={styles.button}
                onPress={signUp}
                raised />
            <View style={{ height: 50 }} />
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padiing: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300
    },
    button: {
        width: 200,
        marginTop: 10,
    }
})