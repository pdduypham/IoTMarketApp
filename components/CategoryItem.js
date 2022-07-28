import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../constants/colors'
import storage from '@react-native-firebase/storage';

const CategoryItem = ({ categoryID, categoryName, categoryImage }) => {

  
  const url = storage().ref('categories/laptop.png').getDownloadURL()

  useEffect(() => {
  })
  return (
    <TouchableOpacity key={categoryID} style={{
      flexDirection: 'column',
      margin: 1,
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryBackground,
      borderRadius: 10
    }}>
      {/* <Image source={{uri: url}}
      style={{
        width: 40,
        height: 40,
      }}
      resizeMode='contain'/> */}
      <Text>{categoryName}</Text>
    </TouchableOpacity>
  )
}

export default CategoryItem

const styles = StyleSheet.create({})