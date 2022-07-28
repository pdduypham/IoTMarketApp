import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { color } from 'react-native-elements/dist/helpers'
import { Button, Input } from 'react-native-elements'
import colors from '../constants/colors'
import firestore from '@react-native-firebase/firestore';
import CategoryItem from '../components/CategoryItem'
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app'
import PostItem from '../components/PostItem'

const HomeScreen = () => {

  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const listCategories = []
        await firestore().collection('categories').get()
          .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              const { categoryName, categoryID, categoryImage } = doc.data()
              listCategories.push({
                categoryName,
                categoryID,
                categoryImage
              })
            })
          })

        setCategories(listCategories)
        if (loading) {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const listPosts = []
        await firestore().collection('posts').get()
          .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              const {
                postTitle,
                postCategory,
                postBranch,
                postStatusOfProduct,
                postStatus,
                postPrice,
                postDescription,
                postTimestamp,
                postImages,
                postOwner,
                postID
              } = doc.data()

              listPosts.push({
                postTitle,
                postCategory,
                postBranch,
                postStatusOfProduct,
                postStatus,
                postPrice,
                postDescription,
                postTimestamp,
                postImages,
                postOwner,
                postID
              })

              setPosts(listPosts)

              if (loading) {
                setLoading(false)
              }
            })
          })
      } catch (error) {
        console.log(error)
      }
    }

    fetchPosts()
  })

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1
      }}>
      <ScrollView stickyHeaderIndices={[1]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>

          {/* Search bar */}
          <TextInput placeholder='Search...'
            rightIcon={require('../assets/home.png')}
            style={{
              ...styles.inputContainer,
              backgroundColor: colors.primaryBackground,
              borderRadius: 10,
              paddingLeft: 10,
              flex: 1,
              marginLeft: 24,
              marginTop: 20
            }} />
          <Image source={require('../assets/search.png')}
            resizeMode='cover'
            style={{
              top: 10,
              right: 45
            }} />
        </View>

        {/* Categories Menu */}
        <View>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginStart: 10,
            marginTop: 20,
          }}>CATEGORIES</Text>
          <ScrollView horizontal>
            {categories.map(category => (
              <CategoryItem key={category.categoryID}
                categoryName={category.categoryName}
                categoryImage={category.categoryImage}
                categoryID={category.categoryID} />
            ))}
          </ScrollView>
        </View>

        {/* List Product */}
        <View>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginStart: 10,
            marginTop: 20,
          }}>RECOMMEND FOR YOU</Text>
          <ScrollView>
            {posts.map(post => (
              <PostItem key={post.postID}/>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 10,
    marginTop: 10
  },
})