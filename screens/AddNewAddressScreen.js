import { Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import SelectDropdown from 'react-native-select-dropdown'
import { Card, CheckBox, Input } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import axios from 'axios';
import { Image } from 'react-native'
import { onPress } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes'

const AddNewAddressScreen = ({ navigation, route }) => {

    const [receiverName, setReceiverName] = useState('')
    const [receiverPhoneNumber, setReceiverPhoneNumber] = useState('')
    const curUserInfor = firebase.auth().currentUser
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
    const [disableButton, setDisableButton] = useState(true)
    const [checkBox, setCheckBox] = useState(false)

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

    //Set Initial Value
    useLayoutEffect(() => {
        curUserInfor.displayName != undefined && setReceiverName(curUserInfor.displayName)
        curUserInfor.phoneNumber != undefined && setReceiverPhoneNumber(curUserInfor.phoneNumber)
    }, [])

    //Validate data
    useEffect(() => {
        receiverName != '' && receiverPhoneNumber != '' &&
            /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(receiverPhoneNumber) &&
            selectedProvince != '' && selectedDistrict != ''
            && selectedWard != '' && receiverAddress != '' ?
            setDisableButton(false) : setDisableButton(true)
    }, [receiverName, receiverPhoneNumber, selectedProvince, selectedDistrict, selectedWard, receiverAddress])

    const addAddress = () => {
        const addDB = async () =>
            await firebase.firestore()
                .collection('users')
                .doc(curUserInfor.uid)
                .collection('receiveAddresses')
                .doc(firebase.firestore.Timestamp.now().seconds.toString())
                .set({
                    receiverName: receiverName,
                    receiverPhoneNumber: receiverPhoneNumber,
                    receiverProvince: selectedProvince,
                    receiverDistrict: selectedDistrict,
                    receiverWard: selectedWard,
                    receiverAddress: receiverAddress,
                    addressType: checkBox ? 0 : 1
                }).then(() => {
                    Alert.alert('Success', 'Add address successfuly', [
                        {
                            title: 'OK',
                            onPress: () => {
                                navigation.goBack()
                            }
                        }
                    ])
                })

        addDB()
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
                            renderErrorMessage={receiverName == '' ? true : false}
                            errorMessage='This field must not empty.'
                            errorStyle={{
                                display: receiverName == '' ? 'flex' : 'none'
                            }}
                        />
                        <Input label={`Phone Number`}
                            placeholder={'Phone Number'}
                            defaultValue={curUserInfor.phoneNumber}
                            onChangeText={(text) => setReceiverPhoneNumber(text)}
                            containerStyle={styles.input}
                            renderErrorMessage={receiverPhoneNumber == '' ? true : false}
                            errorMessage='Please input valid phone number.'
                            errorStyle={{
                                display: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(receiverPhoneNumber) ? 'none' : 'flex'
                            }}
                            keyboardType='phone-pad'
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
                                    setSelectedDistrict('')
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
                                    setSelectedWard('')
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
                            renderErrorMessage={receiverAddress == '' ? true : false}
                            errorMessage='This field must not empty.'
                            errorStyle={{
                                display: receiverAddress == '' ? 'flex' : 'none'
                            }}
                        />
                        <CheckBox
                            containerStyle={{
                                marginTop: 10,
                                backgroundColor: 'white',
                                borderWidth: 0,
                                padding: 0
                            }}
                            checked={checkBox}
                            title='Set this address to default address.'
                            onPress={() => setCheckBox(!checkBox)}
                            uncheckedIcon={<Image source={require('../assets/uncheck.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24
                                }} />}
                            checkedIcon={<Image source={require('../assets/check.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24
                                }} />}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity
                onPress={addAddress}
                disabled={disableButton}
                style={{
                    ...styles.touchContainer,
                    backgroundColor: disableButton ? colors.primaryBackground : colors.primary
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
        paddingBottom: 15,
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