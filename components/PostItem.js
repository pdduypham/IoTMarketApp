import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

const PostItem = ({ postTitle, postPrice, postTimestamp, postImages }) => {
  const [time, setTime] = useState('')
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
      console.log('aaa')
    }else{
      var a = storage().ref(postImages).listAll().then((url) =>{
        console.log(url)
      })
      // console.log(a)
    }
  }, [])

  return (
    <TouchableOpacity style={{
      width: '50%',
      padding: 5
    }}>
      <Card containerStyle={styles.container}>
        <Image source={require('../assets/logo.jpg')}
          resizeMode='contain'
          style={{
            width: '100%',
            height: '55%',
            borderRadius: 10
          }} />
        <Text style={{
          fontWeight: 'bold',
          marginTop: 5
        }}>{postTitle}</Text>
        <Text style={{
          color: 'red'
        }}>{parseInt(postPrice)} đ</Text>
        <Text style={{
          fontSize: 12
        }}>{time}</Text>
      </Card>
    </TouchableOpacity>
  )
}

export default PostItem

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
    margin: 0,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10
  },
})