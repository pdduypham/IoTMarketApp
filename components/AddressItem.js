import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import fonts from '../constants/fonts'
import colors from '../constants/colors'
import { Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import Toast from 'react-native-simple-toast';

const AddressItem = ({ data, onPress }) => {

    let [name, setName] = useState('')
    let [phone, setPhone] = useState('')
    let [address, setAddress] = useState('')
    let [province, setProvince] = useState('')
    let [district, setDistrict] = useState('')
    let [ward, setWard] = useState('')
    let [isDefault, setisDefault] = useState(false)
    let [createAt, setCreateAt] = useState('')
    const [open, setOpen] = useState(false)
    const curUserInfor = firebase.auth().currentUser

    //Get data
    useEffect(() => {
        setName(data.receiverName)
        setPhone(data.receiverPhoneNumber)
        setAddress(data.receiverAddress)
        setProvince(data.receiverProvince)
        setDistrict(data.receiverDistrict)
        setWard(data.receiverWard)
        setisDefault(data.addressType)
        setCreateAt(data.createAt)
    }, [data])

    //Set is Default Address
    const setIsDefault = async () => {
        await firebase.firestore()
            .collection('users')
            .doc(curUserInfor.uid)
            .collection('receiveAddresses')
            .get()
            .then((address) => {
                address.docs.map((doc) => {
                    doc.data().addressType &&
                        firebase.firestore()
                            .collection('users')
                            .doc(curUserInfor.uid)
                            .collection('receiveAddresses')
                            .doc(doc.data().createAt)
                            .update({
                                addressType: false
                            })
                })

                firebase.firestore()
                    .collection('users')
                    .doc(curUserInfor.uid)
                    .collection('receiveAddresses')
                    .doc(createAt)
                    .update({
                        addressType: true
                    }).then(() => setOpen(!open))
            })
    }

    //Delete Address
    const deleteAddress = async () => {
        isDefault ? Toast.show('Can not delete default address!', Toast.SHORT) :
            Alert.alert('Confirm', 'Are you sure you want to delete this address?', [
                {
                    text: 'Yes',
                    onPress: async () => await firebase.firestore()
                        .collection('users')
                        .doc(curUserInfor.uid)
                        .collection('receiveAddresses')
                        .doc(createAt)
                        .delete()
                        .then(() => {
                            Toast.show('Deleted this address', Toast.SHORT)
                        })
                },

                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ])


    }

    return (
        <Card containerStyle={styles.container}>
            <TouchableOpacity>
                < View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: fonts.bold,
                        fontSize: 18
                    }}>{name}</Text>
                    <Text> | {phone}</Text>
                    <View style={{
                        flex: 1
                    }} />
                    <TouchableOpacity onPress={() => setOpen(!open)}>
                        <Image source={require('../assets/more_vertical.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24
                            }} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginTop: 5,
                    marginBottom: 5
                }}>
                    <Text>{address}, {ward}, {district}, {province}</Text>
                </View>
                {isDefault && <View style={{
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    padding: 5,
                    alignItems: 'center',
                    marginHorizontal: 60
                }}>
                    <Text style={styles.textButton}>Default Address</Text>
                </View>}
                <View style={{
                    display: open ? 'flex' : 'none'
                }}>
                    {!isDefault && <TouchableOpacity
                        onPress={() => {
                            setIsDefault()
                            onPress([{
                                name: name,
                                phone: phone,
                                address: address,
                                ward: ward,
                                district: district,
                                province: province,
                                createAt: createAt
                            }
                            ])
                        }}
                        style={{
                            ...styles.touch,
                            backgroundColor: 'orange'
                        }}>
                        <Text style={styles.textButton}>Set is Default</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                        onPress={deleteAddress}
                        style={{
                            ...styles.touch,
                            marginTop: 5,
                            backgroundColor: 'red'
                        }}>
                        <Text style={styles.textButton}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            onPress([{
                                name: name,
                                phone: phone,
                                address: address,
                                ward: ward,
                                district: district,
                                province: province,
                                createAt: createAt
                            }
                            ])
                        }}
                        style={{
                            ...styles.touch,
                            backgroundColor: colors.primary,
                            marginTop: 5
                        }}>
                        <Text style={styles.textButton}>Choose</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card >
    )
}

export default AddressItem

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginHorizontal: 0,
        marginVertical: 10,
        borderRadius: 10
    },

    touch: {
        alignItems: 'center',
        borderRadius: 10,
        padding: 5,
        marginHorizontal: 60
    },

    textButton: {
        color: 'white',
        fontFamily: fonts.normal
    }
})