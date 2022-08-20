import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import firebase from '@react-native-firebase/app'
import AddressItem from '../components/AddressItem'
import { CheckBox } from 'react-native-elements'

const ListAddressesScreen = ({ navigation, route }) => {

  const curUser = firebase.auth().currentUser.uid
  const [address, setAddress] = useState([])

  //Navigation Header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Receive Address',
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white'
      }
    })
  })

  const chooseAddress = () => {
    alert('alo')
  }

  //Fetch Receiver's Address
  useEffect(() => {
    const fetchAddress = async () => {
      await firebase.firestore()
        .collection('users')
        .doc(curUser)
        .collection('receiveAddresses')
        .get()
        .then((addresses) => {
          setAddress(addresses.docs.map((doc) => ({
            id: doc.id,
            data: doc.data()
          })))
        })
    }
    fetchAddress()
    // address.length == 0 && navigation.navigate('AddNewAddress')
  }, [route, navigation])

  return (
    <SafeAreaView style={styles.container}>
      {address.map((data, index) => (
        <AddressItem key={index} data={data} />
      ))}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddNewAddress')
        }}
        style={{
          ...styles.touchContainer,
          borderWidth: 1,
          borderColor: 'orange',
        }}>
        <Image source={require('../assets/plus.png')}
          resizeMethod='resize'
          resizeMode='contain'
          style={{
            width: 24,
            height: 24,
            marginRight: 10
          }} />
        <Text style={{
          color: 'orange',
          fontFamily: fonts.normal,
        }}>Add New Address</Text>
      </TouchableOpacity>
      <View style={{
        flex: 1
      }} />
      <TouchableOpacity
        onPress={chooseAddress}
        style={{
          ...styles.touchContainer,
          backgroundColor: colors.primary,
          marginBottom: 20
        }}>
        <Text style={{
          color: 'white',
          fontFamily: fonts.bold,
        }}>Choose</Text>
      </TouchableOpacity>
    </SafeAreaView >
  )
}

export default ListAddressesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10
  },
  touchContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 10
  }
})