import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('TabBar', { routeName: 'Home' })
        firebase.firestore()
          .collection('users')
          .doc(authUser.uid)
          .update({
            onlineStatus: 'online'
          })
      }
    })
    return unsubscribe
  }, [])

  const signIn = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();

    auth().signInWithEmailAndPassword(email, password)
      .then(async () => {
        await firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .update({
            onlineStatus: 'online',
            deviceToken: token
          })
      })
      .catch((error) => alert(error))
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
          autoFocus
          textContentType='emailAddress'
          value={email}
          onChangeText={(text) => setEmail(text)} />
        <Input placeholder='Password'
          secureTextEntry
          textContentType='password'
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn} />
      </View>
      <Button title={'Log In'}
        containerStyle={styles.button}
        onPress={signIn} />
      <Button title={'Sign Up'} containerStyle={styles.button} type='outline'
        onPress={() => navigation.navigate('SignUp')} />
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

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