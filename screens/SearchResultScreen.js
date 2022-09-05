import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import colors from '../constants/colors'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import { useEffect } from 'react'
import firebase from '@react-native-firebase/app'
import { useState } from 'react'
import PostItemHorizontal from '../components/posts/PostItemHorizontal'

const SearchResultScreen = ({ navigation, route }) => {

    const [posts, setPosts] = useState([])

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

    //Get Posts
    useEffect(() => {
        if (route.params.category != null) {
            firebase.firestore()
                .collection('posts')
                .orderBy('postTimestamp', 'desc')
                .where('postCategory', '==', route.params.category)
                .get()
                .then((post) => {
                    setPosts(post.docs.map((doc) => doc.data()))
                })
        } else {
            firebase.firestore()
                .collection('posts')
                .where('postTitle', 'array-contains', route.params.keyword)
                .orderBy('postTimestamp', 'desc')
                .get()
                .then((post) => {
                    setPosts(post.docs.map((doc) => doc.data()))
                })
        }

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

        navigation.navigate("PostDetail", { postStatus, postID, postTimestamp, postBrand, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{
                flex: 1,
            }}>
                {posts.map((data) =>
                    <PostItemHorizontal data={data} key={data.postID} onPress={detailPost} />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchResultScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },
})