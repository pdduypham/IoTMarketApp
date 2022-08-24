import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import colors from '../constants/colors'

const MoreScreen = ({ navigation }) => {

  const curUserInfo = firebase.auth().currentUser
  const [curUser, setCurUser] = useState()

  useEffect(() => {
    const subs = firebase.auth().onAuthStateChanged
  })

  return (
    <SafeAreaView style={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateUser')}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Avatar rounded
              size={64}
              avatarStyle={{
                borderColor: colors.primaryBackground,
                borderWidth: 1
              }}
              source={require('../assets/logo.jpg')} />
            <View style={{
              flexDirection: 'column',
              flex: 1
            }}>
              <Text style={{
                fontFamily: fonts.bold,
                fontSize: 24,
                marginLeft: 10
              }}>{curUserInfo.displayName}</Text>
              <View style={{
                width: '95%',
                borderWidth: 0.5,
                borderColor: colors.primaryBackground,
                alignSelf: 'center'
              }} />
              <Text style={{
                fontFamily: fonts.normal,
                marginLeft: 10,
                marginTop: 5
              }}>{curUserInfo.phoneNumber}0383676158</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </SafeAreaView>
  )
}

export default MoreScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5
  },

  cardContainer: {
    borderRadius: 10,
    marginHorizontal: 0,
    paddingLeft: 5,
    paddingRight: 5,
  },
})