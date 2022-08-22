import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import firebase from '@react-native-firebase/app'
import AddressItem from '../components/AddressItem'
import { CheckBox } from 'react-native-elements'
import { LogBox } from 'react-native'

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
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ])

  //Fetch Receiver's Address
  useEffect(() => {
    const fetchAddress = async () => {
      firebase.firestore()
        .collection('users')
        .doc(curUser)
        .collection('receiveAddresses')
        .orderBy('addressType', 'desc')
        .onSnapshot((dataSnapshot) => {
          setAddress(dataSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data()
          })))
        })
    }
    fetchAddress()
  }, [route, navigation])

  //Get data from child component.
  let getData = (childData) => {
    route.params.onPress(childData)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {address.map((data, index) => (
          <AddressItem key={index} data={data.data} onPress={getData} />
        ))}
      </ScrollView>
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20
  }
})