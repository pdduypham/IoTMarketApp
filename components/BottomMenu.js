import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../constants/colors'
import { Image } from 'react-native-elements'
import fonts from '../constants/fonts'

const BottomMenu = ({ navigation }) => {

    const directMessage = () => {
        navigation.navigate('Chats')
    }

    const phoneNumber = '0383676159'

    const callFunction = () => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    const smsFunction = () => {
        Linking.openURL(`sms:${phoneNumber}`)
    }

    const buyFunction = () => {
        navigation.navigate('Buy')
    }

    return (
        <View style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: colors.primaryBackground,
            borderRadius: 15,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
            flexDirection: 'row'
        }}>
            <TouchableOpacity
                onPress={callFunction}
                style={{
                    flexDirection: 'row',
                    width: '25%',
                    justifyContent: 'center'
                }}>
                <Image source={require('../assets/call.png')}
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={{
                        width: 36,
                        width: 36
                    }} />
                <Text style={{
                    fontFamily: fonts.bold
                }}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={smsFunction}
                style={{
                    flexDirection: 'row',
                    width: '25%'
                }}>
                <Image source={require('../assets/sms.png')}
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={{
                        width: 36,
                        width: 36
                    }} />
                <Text style={{
                    fontFamily: fonts.bold
                }}>SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={directMessage}
                style={{
                    flexDirection: 'row',
                    width: '25%'
                }}>
                <Image source={require('../assets/chosen_chat.png')}
                    resizeMethod='resize'
                    resizeMode='contain'
                    style={{
                        width: 36,
                        width: 36
                    }} />
                <Text style={{
                    fontFamily: fonts.bold
                }}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={buyFunction}
                style={{
                    flexDirection: 'row',
                    width: '25%',
                    backgroundColor: colors.primary,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                }}>
                <Text style={{
                    color: 'white',
                    fontFamily: fonts.bold
                }}>BUY NOW</Text>
            </TouchableOpacity>

        </View>
    )
}

export default BottomMenu

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
})