import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import firebase from '@react-native-firebase/app'
import PostItemHorizontal from './PostItemHorizontal'
import ViewHide from '../ViewHide'

const PostPending = ({ navigation, route }) => {

  const curUser = firebase.auth().currentUser.uid
  const [posts, setPosts] = useState([])

  //Listen for Posts Update
  useEffect(() => {
    const fetchPosts = () => {
      firebase.firestore()
        .collection('posts')
        .where('postOwner', '==', curUser)
        .where('postStatus', 'in', [0])
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
    let postBranch = data.postBranch
    let postDescription = data.postDescription
    let postCategory = data.postCategory
    let postTitle = data.postTitle
    let postDisplayName = data.postDisplayName
    let postStatusOfProduct = data.postStatusOfProduct
    let postPrice = data.postPrice
    let postOwner = data.postOwner
    let postImages = data.postImages
    let postStatus = data.postStatus

    navigation.navigate("PostDetail", { postStatus, postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
  }

  useEffect(() => {
    navigation.setOptions({
      tabBarLabel: `Pending (${posts.length})`
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

export default PostPending

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 95,
    flex: 1
  }
})