import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PostItem = ({postTitle}) => {
  return (
    <View>
      <Text>{postTitle}</Text>
    </View>
  )
}

export default PostItem

const styles = StyleSheet.create({})