import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopTabBar from '../components/TopTabBar'

const PostsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TopTabBar />
    </SafeAreaView>
  )
}
export default PostsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})