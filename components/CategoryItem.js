import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'

const CategoryItem = ({ categoryID, categoryName, categoryImage }) => {

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
    <TouchableOpacity key={categoryID} style={{
      flexDirection: 'column',
      margin: 1,
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryBackground,
      borderRadius: 10,
      paddingBottom: 5,
      paddingTop: 5
    }}>
      <Image source={{ uri: imageURL }}
        style={{
          width: 50,
          height: 50,
          flex: 1
        }}
        resizeMode='contain' />
      <Text style={{
        fontWeight: 'bold'
      }}>{categoryName}</Text>
    </TouchableOpacity>
  )
}

export default CategoryItem

const styles = StyleSheet.create({})