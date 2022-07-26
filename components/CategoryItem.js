import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { ListItem } from 'react-native-elements'

const CategoryItem = ({categoryID, categoryName, categoryImage}) => {
  return (
    <View>
      <ListItem key={categoryID} bottomDivider 
      style={{
        justifyContent:'center'
      }}>
            <ListItem.Content>
                <ListItem.Title>
                    {categoryName}
                </ListItem.Title>
            </ListItem.Content>
            <Image source={require('../assets/next.png')}
            resizeMode={'contain'}
            style={{
                width: 16, 
                height: 16,
                paddingEnd: 40
            }}/>
      </ListItem>
    </View>
  )
}

export default CategoryItem

const styles = StyleSheet.create({})