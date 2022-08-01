import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import fonts from '../constants/fonts'

const PostItem = ({ postTitle, postPrice, postTimestamp, postImages, postID, onPress }) => {
  const [time, setTime] = useState('')
  const [imageURL, setImageURL] = useState('https://i.pinimg.com/564x/64/ba/95/64ba9507533272c92924364a6c451ca2.jpg')

  //Convert time
  useEffect(() => {
    let temp = (firebase.firestore.Timestamp.now().seconds - postTimestamp) / 60
    if (temp < 60) {
      setTime(temp.toFixed(0) + ' munites ago')
    } else {
      if (temp > 60 && (temp / 60) < 24) {
        setTime((temp / 60).toFixed(0) + ' hours ago')
      } else {
        if ((temp / 60) > 24) {
          setTime((temp / 60 / 24).toFixed(0) + ' days ago')
        }
      }
    }
  })

  //Get Image
  useEffect(() => {
    if (postImages == 'No image') {
      setImageURL(require('../assets/logo.jpg'))
    } else {
      const fetchImages = async () => {
        (await firebase.storage().ref(postImages).list())
          .items.pop().getDownloadURL().then((url) => {
            setImageURL(url)
          })
      }
      fetchImages()
    }
  }, [])

  //Handle Click
  // const detailPost = () => {
  //   alert(postID)
  // }

  return (
    <TouchableOpacity onPress={()=> onPress(postTitle,postPrice)} 
    style={{
      width: '50%',
      padding: 5
    }}>
      <Card containerStyle={styles.container}>
        <Image source={postImages == 'No image' ? imageURL : { uri: imageURL }}
          resizeMode='cover'
          style={{
            width: '100%',
            height: '55%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }} />
        <View style={{
          paddingLeft: 10
        }}>
          <Text style={{
            marginTop: 5,
            fontFamily: fonts.bold
          }}>{postTitle}</Text>
          <Text style={{
            color: 'red',
            fontFamily: fonts.normal
          }}>{parseInt(postPrice)} đ</Text>
          <Text style={{
            fontSize: 12,
            fontFamily: fonts.light
          }}>{time}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

export default PostItem

const styles = StyleSheet.create({
  container: {
    height: 162,
    width: '100%',
    margin: 0,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 0
  },
})