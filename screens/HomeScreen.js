import { StyleSheet, Text, View, Image, KeyboardAvoidingView, StatusBar, SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { color } from 'react-native-elements/dist/helpers'
import { Button, Input } from 'react-native-elements'
import colors from '../constants/colors'
import firestore from '@react-native-firebase/firestore';
import CategoryItem from '../components/CategoryItem'
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app'

const HomeScreen = () => {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = []
        await firestore().collection('categories').get()
          .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              const { categoryName, categoryID, categoryImage } = doc.data()
              list.push({
                categoryName,
                categoryID,
                categoryImage
              })
            })
          })

        setCategories(list)
        if (loading) {
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [])

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
                categoryImage = {category.categoryImage}
                categoryID = {category.categoryID} />
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