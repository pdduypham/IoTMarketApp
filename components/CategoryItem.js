import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import fonts from '../constants/fonts'

const CategoryItem = ({ navigation, categoryID, categoryName, categoryImage }) => {

  const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')

  useEffect(() => {
    const fetchImage = async () => await firebase.storage().ref(categoryImage)
      .getDownloadURL()
      .then((url) => {
        setImageURL(url)
      })
    fetchImage()
  }, [])
  return (
    <TouchableOpacity key={categoryID}
      onPress={() => navigation.navigate('SearchResult', { category: categoryName })}
      style={{
        flexDirection: 'column',
        marginLeft: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryBackground,
        borderRadius: 10,
        padding: 3
      }}>
      <Image source={{ uri: imageURL }}
        style={{
          width: 30,
          height: 30,
          flex: 1
        }}
        resizeMode='contain' />
      <Text style={{
        fontSize: 12,
        fontFamily: fonts.bold
      }}>{categoryName}</Text>
    </TouchableOpacity>
  )
}

export default CategoryItem

const styles = StyleSheet.create({})