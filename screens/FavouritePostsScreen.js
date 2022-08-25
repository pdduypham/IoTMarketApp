import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
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
        const getFavouritePosts = async () => {
            await firebase.firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('favourites')
                .get()
                .then((docs) => {
                    docs.docs.forEach((doc) => {
                        firebase.firestore()
                            .collection('posts')
                            .doc(doc.data().postID)
                            .get()
                            .then((data) => {
                                setFavouritePosts([...favouritePosts, data.data()])
                            })
                    })
                })
        }
        getFavouritePosts()
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

    return (
        <SafeAreaView style={styles.container}>
            {favouritePosts.map((data) => {
                return (
                    <PostItemHorizontal data={data} key={data.postID} onPress={detailPost} />
                )
            })}
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