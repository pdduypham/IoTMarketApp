import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import PostItemHorizontal from '../components/posts/PostItemHorizontal'

const FavouritePostsScreen = ({ navigation }) => {

    const [favouritePosts, setFavouritePosts] = useState([])
    let list = []
    let list1 = []

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
        const getPostID = async () => {
            await firebase.firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('favourites')
                .get()
                .then((docs) => {
                    docs.docs.map(data => list.push(data.data().postID))
                })
        }

        const getPostData = () => {
            list.forEach((item) => {
                firebase.firestore()
                    .collection('posts')
                    .doc(item)
                    .get()
                    .then((data) => {
                        list1.push(data.data())
                    })
            })

            setFavouritePosts(list1)
        }

        getPostID().then(() => {
            getPostData()
            console.log(favouritePosts)
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
            <ScrollView>
                {/* {favouritePosts.map((data) =>
                    <PostItemHorizontal data={data} key={data.postId} onPress={detailPost} />
                )} */}
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