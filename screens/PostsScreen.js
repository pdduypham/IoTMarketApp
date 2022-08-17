import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopTabBar from '../components/TopTabBar'

const PostsScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TopTabBar routeName={route.params.name} />
    </SafeAreaView>
  )
}
export default PostsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})