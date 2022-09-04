import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, ScrollView, FlatList, RefreshControl, DevSettings, TouchableOpacity } from 'react-native'
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
  const [countNotify, setCountNotify] = useState(0)
  const curUserInfo = firebase.auth().currentUser
  const [searchInput, setSearchInput] = useState('')

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

  const detailPost = (postStatus, postID, postTimestamp, postBrand, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages) => {
    navigation.navigate("PostDetail", { postStatus, postID, postTimestamp, postBrand, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
  }

  //Count notifies
  useEffect(() => {
    const countNotifies = async () =>
      firebase.firestore()
        .collection('users')
        .doc(curUserInfo.uid)
        .collection('notifies')
        .onSnapshot((documentSnapshot) => {
          let total = documentSnapshot.size
          documentSnapshot.docs.map((doc) => {
            !doc.data().notifyStatus ? total : total--
          })
          setCountNotify(total)
        })
    countNotifies()
  }, [])

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
          backgroundColor: colors.primary
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {/* Search bar */}
            <TextInput placeholder='Search...'
              onChangeText={(text) => setSearchInput(text)}
              onSubmitEditing={() => {
                navigation.navigate('SearchResult', { keyword: searchInput })
                setSearchInput('')
              }}
              rightIcon={require('../assets/home.png')}
              style={{
                ...styles.inputContainer,
                backgroundColor: colors.primaryBackground,
                borderRadius: 10,
                paddingLeft: 10,
                flex: 1,
                fontFamily: fonts.normal,
                height: 40,
                justifyContent: 'center',
                marginBottom: 10
              }} />

            <TouchableOpacity onPress={() => navigation.navigate('Notify')}>
              <Image source={require('../assets/bell.png')}
                resizeMethod='resize'
                resizeMode='contain'
                style={{
                  width: 34,
                  height: 34,
                  marginRight: 15,
                  zIndex: 1
                }} />
              {countNotify != 0 && <Text style={{
                color: 'red',
                zIndex: 0,
                position: 'absolute',
                top: 5,
                right: countNotify < 10 ? 27 : 23,
                fontFamily: fonts.normal,
                fontSize: 16
              }}>{countNotify}</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Ads view */}
        <TouchableOpacity style={styles.adsView}>
          <Text style={{
            fontFamily: fonts.bold,
            fontSize: 24,
            color: 'white'
          }}>Get discount up to 50%</Text>
          <Text></Text>
          <Text style={{
            fontFamily: fonts.normal,
            fontSize: 16,
            color: 'white'
          }}>Get a big discount with a very limited time, what are you waiting for shop now!</Text>
        </TouchableOpacity>

        {/* Categories Menu */}
        <View>
          <Text style={{
            fontSize: 18,
            marginLeft: 10,
            fontFamily: fonts.bold,
            marginTop: 5
          }}>CATEGORIES</Text>
          <ScrollView horizontal style={{
            marginLeft: 10,
            marginTop: 5
          }}>
            {categories.map(category => (
              <CategoryItem key={category.categoryID}
                categoryName={category.categoryName}
                categoryImage={category.categoryImage}
                categoryID={category.categoryID}
                navigation={navigation} />
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
              postBrand,
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
                postBrand={postBrand}
                postCategory={postCategory}
                postDescription={postDescription}
                postStatusOfProduct={postStatusOfProduct}
                postStatus={postStatus} />
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
  adsView: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10
  }
})