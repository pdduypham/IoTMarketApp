import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import firebase from '@react-native-firebase/app'
import PostItemHorizontal from './PostItemHorizontal'
import ViewHide from '../ViewHide'

const PostRejected = ({ navigation, route }) => {
  const curUser = firebase.auth().currentUser.uid
  const [posts, setPosts] = useState([])

  //Listen for Posts Update
  useEffect(() => {
    const fetchPosts = () => {
      firebase.firestore()
        .collection('posts')
        .where('postOwner', '==', curUser)
        .where('postStatus', 'in', [2])
        .orderBy('postTimestamp', 'desc')
        .onSnapshot(documentSnapshot => {
          setPosts(documentSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data()
          })))
        })
    }

    fetchPosts()
  }, [])

  const detailPost = (data) => {
    let postID = data.postID
    let postTimestamp = data.postTimestamp
    let postBrand = data.postBrand
    let postDescription = data.postDescription
    let postCategory = data.postCategory
    let postTitle = data.postTitle
    let postDisplayName = data.postDisplayName
    let postStatusOfProduct = data.postStatusOfProduct
    let postPrice = data.postPrice
    let postOwner = data.postOwner
    let postImages = data.postImages
    let postStatus = data.postStatus
    let postReason = data.postReason

    navigation.navigate("PostDetail", { postReason, postStatus, postID, postTimestamp, postBrand, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
  }

  useEffect(() => {
    navigation.setOptions({
      tabBarLabel: `Rejected (${posts.length})`
    })
  })

  return (
    <View style={styles.container}>
      <ScrollView >
        {posts.map(({ id, data }) => (
          <PostItemHorizontal key={id} data={data} onPress={detailPost} />
        ))}
      </ScrollView>
      <ViewHide />
    </View>
  )
}

export default PostRejected

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 95,
    flex: 1
  }
})