import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import SelectDropdown from 'react-native-select-dropdown'
import { Card, Input } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import axios from 'axios';
import { Image } from 'react-native'
import QueryString from 'query-string'

const AddNewAddressScreen = ({ navigation, route }) => {

    const [receiverName, setReceiverName] = useState('')
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('')
    const [curUserInfor, setCurUserInfo] = useState('')
    const token = '9c452848-1ec3-11ed-8730-6627a1705dca'
    const type = 'application/json'
    const [provinceName, setProvinceName] = useState([])
    const [provinceID, setProvinceID] = useState([])
    const [selectedProvince, setSelectedProvince] = useState('')
    const [selectedProvinceIndex, setSelectedProvinceIndex] = useState(-1)
    const [district, setDistrict] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [districtID, setDistrictID] = useState([])
    const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(-1)
    const [ward, setWard] = useState([])
    const [selectedWard, setSelectedWard] = useState('')
    const [wardID, setWardID] = useState([])
    const [selectedWardIndex, setSelectedWardIndex] = useState(-1)
    const provinceRef = useRef({})
    const districtRef = useRef({})
    const wardRef = useRef({})
    const [receiverAddress, setReceiverAddress] = useState('')

    //Navigation Header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Receive Address',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    })

    //Get Default Information of User
    useLayoutEffect(() => {
        setCurUserInfo(firebase.auth()
            .currentUser.toJSON())
    }, [])

    //Set Initial Value
    useEffect(() => {
        curUserInfor.displayName != undefined && setReceiverName(curUserInfor.displayName)
        curUserInfor.phoneNumber != undefined && setReceiverPhoneNumber(curUserInfor.phoneNumber)
    })

    //API Get Province
    useEffect(() => {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province'
        axios.get(url, {
            headers: {
                token: token,
                'Content-Type': type
            }
        }).then((response) => {
            setProvinceName(response.data.data.map((eachProvince) => (
                eachProvince.ProvinceName
            )))

            setProvinceID(response.data.data.map((eachProvince) => (
                eachProvince.ProvinceID
            )))
        }).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        })
    }, [])

    //API Get District
    useEffect(() => {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district'
        if (selectedProvinceIndex >= 0) {
            axios.get(url, {
                headers: {
                    token: token,
                    'Content-Type': type
                },
                data: {
                    'token': token,
                    'province_id': 202
                }
            })
                .then((response) => {
                    let listName = []
                    let listID = []
                    response.data.data.map((eachDistrict) => {
                        if (eachDistrict.ProvinceID == provinceID[selectedProvinceIndex]) {
                            listName.push(eachDistrict.DistrictName)
                            listID.push(eachDistrict.DistrictID)
                        }
                    })
                    setDistrict(listName)
                    setDistrictID(listID)
                })
        }
    }, [selectedProvinceIndex])

    //API Get Ward
    useEffect(() => {
        const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward'
        if (selectedDistrictIndex >= 0) {
            axios({
                method: 'post',
                url: url,
                data: {
                    district_id: districtID[selectedDistrictIndex]
                },
                headers: {
                    "Content-Type": "application/json",
                    token: token
                }
            }).then((response) => {
                setWard(response.data.data.map((eachWard) => (
                    eachWard.WardName
                )))
            })
        }
    }, [selectedDistrictIndex])

    const addAddress = () => {
        alert('hello')
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <ScrollView>
                    <Text style={{
                        fontFamily: fonts.normal,
                        marginTop: 10
                    }}>Please fill in the correct information so that the seller can contact you.</Text>
                    <Card containerStyle={styles.cardContainer}>
                        <Input label={`Name`}
                            placeholder={'Name'}
                            defaultValue={curUserInfor.displayName}
                            onChangeText={(text) => setReceiverName(text)}
                            containerStyle={styles.input}
                            renderErrorMessage={false}
                        />
                        <Input label={`Phone Number`}
                            placeholder={'Phone Number'}
                            defaultValue={curUserInfor.phoneNumber}
                            onChangeText={(text) => setReceiverPhoneNumber(text)}
                            containerStyle={styles.input}
                            renderErrorMessage={false}
                        />
                        <View style={{
                            marginTop: 10,
                            marginHorizontal: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={provinceName}
                                defaultButtonText='Province'
                                ref={provinceRef}
                                search={true}
                                searchPlaceHolder='Search Province'
                                buttonStyle={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                                buttonTextStyle={{
                                    textAlign: 'left'
                                }}
                                renderDropdownIcon={() =>
                                    <Image source={require('../assets/dropdown.png')} />}
                                onSelect={(selectedItem, index) => {
                                    setSelectedProvince(selectedItem)
                                    setSelectedProvinceIndex(index)
                                    districtRef.current.reset()
                                    wardRef.current.reset()
                                    setSelectedDistrictIndex(-1)
                                }}
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>

                        <View style={{
                            marginTop: 10,
                            marginHorizontal: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={district}
                                defaultButtonText='District'
                                searchPlaceHolder='Search District'
                                disabled={selectedProvinceIndex < 0 ? true : false}
                                ref={districtRef}
                                buttonStyle={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                                search={true}
                                buttonTextStyle={{
                                    textAlign: 'left'
                                }}
                                renderDropdownIcon={() =>
                                    <Image source={require('../assets/dropdown.png')} />}
                                onSelect={(selectedItem, index) => {
                                    setSelectedDistrict(selectedItem)
                                    setSelectedDistrictIndex(index)
                                    wardRef.current.reset()
                                }}
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>

                        <View style={{
                            marginTop: 10,
                            marginHorizontal: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={ward}
                                defaultButtonText='Ward'
                                ref={wardRef}
                                searchPlaceHolder='Search Ward'
                                disabled={selectedDistrictIndex < 0 ? true : false}
                                buttonStyle={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                                search={true}
                                buttonTextStyle={{
                                    textAlign: 'left'
                                }}
                                renderDropdownIcon={() =>
                                    <Image source={require('../assets/dropdown.png')} />}
                                onSelect={(selectedItem, index) => {
                                    setSelectedWard(selectedItem)
                                    setSelectedWardIndex(index)
                                }}
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>
                        <Input label={`Address`}
                            placeholder={'Address'}
                            onChangeText={(text) => setReceiverAddress(text)}
                            containerStyle={styles.input}
                            renderErrorMessage={false}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity
                onPress={addAddress}
                style={{
                    ...styles.touchContainer,
                    backgroundColor: colors.primary,
                }}>
                <Text style={{
                    color: 'white',
                    fontFamily: fonts.bold,
                }}>Add</Text>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

export default AddNewAddressScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },

    input: {
        marginTop: 10,
    },

    cardContainer: {
        marginHorizontal: 0,
        marginTop: 10,
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 20,
        borderRadius: 10
    },

    touchContainer: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignSelf: 'center'
    }
})