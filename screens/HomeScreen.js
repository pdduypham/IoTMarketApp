import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, ScrollView, FlatList, RefreshControl, DevSettings } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { color } from 'react-native-elements/dist/helpers'
import { Button, Input } from 'react-native-elements'
import colors from '../constants/colors'
import firestore from '@react-native-firebase/firestore';
import CategoryItem from '../components/CategoryItem'
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app'
import PostItem from '../components/PostItem'
import ViewHide from '../components/ViewHide'
import fonts from '../constants/fonts'
const HomeScreen = ({ navigation }) => {

  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = React.useState(false);
  //Refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false)
    }, 100);
  }, []);

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

  //Listen for realtime update post
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

  const detailPost = (postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages) => {
    navigation.navigate("PostDetail", { postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1
      }}>
      <ScrollView stickyHeaderIndices={[0]}
        style={{
          marginBottom: 90
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
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
              fontFamily: fonts.normal,
              height: 40,
              justifyContent: 'center'
            }} />
          <Image source={require('../assets/search.png')}
            resizeMode='cover'
            style={{
              top: 22,
              right: 30,
              position: 'absolute'
            }} />
        </View>

        {/* Categories Menu */}
        <View>
          <Text style={{
            fontSize: 18,
            marginLeft: 10,
            fontFamily: fonts.bold,
            marginTop: 10
          }}>CATEGORIES</Text>
          <ScrollView horizontal style={{
            marginLeft: 10,
            marginTop: 5
          }}>
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
            fontSize: 18,
            marginStart: 10,
            marginTop: 10,
            fontFamily: 'OpenSans-Bold'
          }}>RECOMMEND FOR YOU</Text>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingHorizontal: 10,
            }}>
            {posts.map(({ id, data: { postTitle,
              postPrice,
              postTimestamp,
              postImages,
              postID,
              postOwner,
              postDisplayName,
              postBranch,
              postCategory,
              postDescription,
              postStatusOfProduct,
              postStatus } }) => (
              postStatus == 1 && <PostItem key={id}
                postTitle={postTitle}
                postPrice={postPrice}
                postTimestamp={postTimestamp}
                postImages={postImages}
                postID={postID}
                onPress={detailPost}
                postOwner={postOwner}
                postDisplayName={postDisplayName}
                postBranch={postBranch}
                postCategory={postCategory}
                postDescription={postDescription}
                postStatusOfProduct={postStatusOfProduct} />
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