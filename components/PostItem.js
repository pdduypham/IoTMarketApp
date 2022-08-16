import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import fonts from '../constants/fonts'

const PostItem = ({ postStatusOfProduct, postDescription, postCategory, postBranch, postDisplayName, postTitle, postPrice, postTimestamp, postImages, postID, onPress, postOwner }) => {
  const [time, setTime] = useState('')
  const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')
  const [totalImages, setTotalImages] = useState(0)

  //Convert time
  useEffect(() => {
    let temp = (firebase.firestore.Timestamp.now().seconds - postTimestamp)
    if (temp < 120) {
      setTime('Just now')
    } else if (temp >= 120 && (temp / 60 / 60) < 1) {
      setTime((temp / 60).toFixed(0) + ' minutes ago')
    } else if ((temp / 60 / 60) >= 1 && (temp / 60 / 60) < 2) {
      setTime('1 hour ago')
    } else if ((temp / 60 / 60) >= 2 && (temp / 60 / 60 / 24) < 1) {
      setTime((temp / 60 / 60).toFixed(0) + ' hours ago')
    } else if ((temp / 60 / 60 / 24) >= 1 && (temp / 60 / 60 / 24) < 2) {
      setTime('1 day ago')
    } else {
      setTime((temp / 60 / 60 / 24).toFixed(0) + ' days ago')
    }
  })

  //Get Image
  useEffect(() => {
    if (postImages == 'No image') {
      setImageURL(require('../assets/logo.jpg'))
      setTotalImages(0)
    } else {
      const fetchImages = async () => {
        const storageRef = await firebase.storage().ref(postImages).listAll()
        storageRef.items.pop().getDownloadURL().then((url) => {
          setImageURL(url)
          setTotalImages(storageRef.items.length + 1)
        })
      }
      fetchImages()
    }
  }, [])

  return (
    <TouchableOpacity onPress={() => onPress(postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages)}
      style={{
        width: Dimensions.get('window').width * 0.473,
        padding: 5
      }}>
      <Card containerStyle={styles.container}>
        <Image source={require('../assets/camera_mini.png')}
          style={{
            width: 32,
            height: 32,
            position: 'absolute',
            top: 5,
            left: 10,
            zIndex: 1,
          }}
          resizeMethod='resize'
          resizeMode='contain' />
        <Text style={{
          zIndex: 2,
          position: 'absolute',
          top: 12,
          left: 22,
          color: 'white',
          fontFamily: fonts.bold,
        }}>{totalImages}</Text>
        <Image source={postImages == 'No image' ? imageURL : { uri: imageURL }}
          resizeMode='cover'
          resizeMethod='resize'
          style={{
            width: '100%',
            height: 140,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 5,
            zIndex: 0
          }} />
        <View style={{
          paddingLeft: 10
        }}>
          <Text style={{
            fontFamily: fonts.bold
          }}>{postTitle}</Text>
          <Text style={{
            color: 'red',
            fontFamily: fonts.normal
          }}>{parseInt(postPrice)} đ</Text>
          <Text style={{
            fontSize: 12,
            fontFamily: fonts.light,
            marginBottom: 5
          }}>{time}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

export default PostItem

const styles = StyleSheet.create({
  container: {
    width: '100%',
    margin: 0,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 0
  },
})