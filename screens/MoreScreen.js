import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import colors from '../constants/colors'
import { useIsFocused } from '@react-navigation/native'

const MoreScreen = ({ navigation }) => {

  const user = firebase.auth().currentUser
  const [curUser, setCurUser] = useState()
  const isFocused = useIsFocused()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    const getCurUser = async () => {
      await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((user) => {
          setCurUser(user.data())
          setFullName(user.data().displayName)
          setPhoneNumber(user.data().phoneNumber)
        })
    }

    getCurUser()

  }, [navigation, isFocused])

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
              }}>{fullName}</Text>
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
              }}>{phoneNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>

      <Card containerStyle={{
        ...styles.cardContainer,
        marginTop: 5
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row'
          }}
          onPress={() => navigation.navigate('ProductsSell')}>
          <Image source={require('../assets/sell.png')}
            resizeMethod='resize'
            resizeMode='contain'
            style={{
              width: 24,
              height: 24,
              marginRight: 10,
              tintColor: 'orange'
            }}
          />
          <Text style={{
            fontFamily: fonts.bold
          }}>Product for Sell</Text>
        </TouchableOpacity>
      </Card>

      <Card containerStyle={{
        ...styles.cardContainer,
        marginTop: 5
      }}>
        <TouchableOpacity style={{
          flexDirection: 'row'
        }}>
          <Image source={require('../assets/buy.png')}
            resizeMethod='resize'
            resizeMode='contain'
            style={{
              width: 24,
              height: 24,
              marginRight: 10,
              tintColor: colors.primary
            }} />
          <Text style={{
            fontFamily: fonts.bold
          }}>Product for Buy</Text>
        </TouchableOpacity>
      </Card>

      <Card containerStyle={{
        ...styles.cardContainer,
        marginTop: 5
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row'
          }}
          onPress={() => navigation.navigate('FavouritePosts')}>
          <Image source={require('../assets/heart.png')}
            resizeMethod='resize'
            resizeMode='contain'
            style={{
              width: 24,
              height: 24,
              marginRight: 10,
              tintColor: 'red'
            }} />
          <Text style={{
            fontFamily: fonts.bold
          }}>Favourite Posts</Text>
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