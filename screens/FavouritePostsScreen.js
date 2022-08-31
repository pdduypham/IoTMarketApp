import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import PostItemHorizontal from '../components/posts/PostItemHorizontal'

const FavouritePostsScreen = ({ navigation }) => {

    const [favouritePosts, setFavouritePosts] = useState([])

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    })

    //Get Favourite Posts
    useEffect(() => {
        let list = []
        let list2 = []
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid.toString())
            .collection('favourites')
            .get()
            .then((postID) => {
                postID.docs.forEach((doc) => {
                    list.push(doc.data().postID)
                })

                firebase.firestore()
                    .collection('posts')
                    .where('postID', 'in', list)
                    .get()
                    .then((data) => {
                        setFavouritePosts(data.docs.map((doc) => doc.data()))
                    })
            })
    }, [navigation])

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

        navigation.navigate("PostDetail", { postStatus, postID, postTimestamp, postBrand, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{
                flex: 1
            }}>
                {favouritePosts.map((data) =>
                    <PostItemHorizontal data={data} key={data.postID} onPress={detailPost} />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default FavouritePostsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})