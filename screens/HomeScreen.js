import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { color } from 'react-native-elements/dist/helpers'
import { Button, Input } from 'react-native-elements'
import colors from '../constants/colors'
import firestore from '@react-native-firebase/firestore';
import CategoryItem from '../components/CategoryItem'
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app'
import PostItem from '../components/PostItem'
import ViewHide from '../components/ViewHide'

const HomeScreen = () => {

  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  //Get Categories Menu
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
  })

  useEffect(() => {
    const subscriber = firestore()
      .collection('posts')
      .orderBy('postTimestamp', 'desc')
      .onSnapshot(documentSnapshot => {
        setPosts(documentSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        })))
      });
    return subscriber
  }, [])

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1
      }}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
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
            marginTop: 10,
          }}>RECOMMEND FOR YOU</Text>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 20,
              paddingTop: 10,
            }}>
            {posts.map(({ id, data: { postTitle,
              postPrice,
              postTimestamp,
              postImages } }) => (
              <PostItem key={id}
                postTitle={postTitle}
                postPrice={postPrice}
                postTimestamp={postTimestamp}
                postImages={postImages} />
            ))}
          </ScrollView>
        </View>

      </ScrollView>
      <ViewHide />
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