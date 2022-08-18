import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'

const ListAddressesScreen = ({ navigation, route }) => {

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

  const addNewAddress = () => {
    navigation.navigate('AddNewAddress')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={addNewAddress}
        style={styles.touchContainer}>
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
    </SafeAreaView>
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
    borderWidth: 1,
    borderColor: 'orange',
    flexDirection: 'row',
    marginTop: 10
  }
})