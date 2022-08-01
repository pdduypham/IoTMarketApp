import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar } from 'react-native-elements'

const PostDetail = ({ navigation, route }) => {

    // //Get Categories Menu
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const listCategories = []
    //             await firestore().collection('categories').get()
    //                 .then((querySnapshot) => {
    //                     querySnapshot.forEach(doc => {
    //                         const { categoryName, categoryID, categoryImage } = doc.data()
    //                         listCategories.push({
    //                             categoryName,
    //                             categoryID,
    //                             categoryImage
    //                         })
    //                     })
    //                 })

    //             setCategories(listCategories)
    //             if (loading) {
    //                 setLoading(false)
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     fetchCategories()
    // })

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detail',
            headerStyle: { backgroundColor: colors.primary },
            headerTitleStyle: { color: "white" },
            hearderTintColor: "white",
            headerTitleAlign: 'center',
            headerShown: true,
        })
    })

    return (
        <View style={styles.container}>
            <Text style={{
                fontFamily: fonts.bold,
                fontSize: 20
            }}>{route.params.postTitle}</Text>
            <Text style={{
                fontFamily: fonts.normal,
                fontSize: 16,
                color: 'red'
            }}>{route.params.postPrice} đ</Text>

            <View>
                <Avatar rounded size={50}
                    source={require('../assets/logo.jpg')} />
            </View>
        </View>

    )
}

export default PostDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 10
    }
})