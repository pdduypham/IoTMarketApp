import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import colors from '../constants/colors'
import firebase from '@react-native-firebase/app'
import PostItemHorizontal from '../components/posts/PostItemHorizontal'
import { useIsFocused } from '@react-navigation/native'

const ProductsBuyScreen = ({ navigation }) => {

    const curUser = firebase.auth().currentUser
    const [sellPosts, setSellPosts] = useState([])
    const isFocus = useIsFocused()


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

    //Get Buy Posts
    useEffect(() => {
        let list = []
        firebase.firestore()
            .collection('orders')
            .where('buyerID', 'in', [curUser.uid.toString()])
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
                        setSellPosts(data.docs.map((doc) => doc.data()))
                    })
            })
    }, [navigation, isFocus])

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
                {sellPosts.map((data) =>
                    <PostItemHorizontal data={data} key={data.postID} onPress={detailPost} />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProductsBuyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})