import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import colors from '../constants/colors'
import ImageView from 'react-native-image-view';


const ImageViewScreen = ({navigation, route}) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Detail',
      headerStyle: { backgroundColor: colors.primary },
      headerTitleStyle: { color: "white" },
      hearderTintColor: "white",
      headerTitleAlign: 'center',
      headerShown: true,
    })
  })

  return (
    <View>
      <Text>{route.params.listImages}</Text>
    </View>
  )
}

export default ImageViewScreen

const styles = StyleSheet.create({})