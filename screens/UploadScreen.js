import { FlatList, SafeAreaView, ScrollView, TextInput, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import colors from '../constants/colors'
import { Button, Input } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const UploadScreen = ({ navigation }) => {

    const [categories, setCategories] = useState()
    const [loading, setLoading] = useState(true)
    let [price, setPrice] = useState()
    const [title, setTitle] = useState()
    let [description, setDescription] = useState()
    const [listImages, setListImages] = useState([])
    let stringPath = 'postsImages/' + auth().currentUser.uid + '/' + Date.now() + '/'

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const list = []
                await firestore().collection('categories').get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(doc => {
                            const { categoryName } = doc.data()
                            list.push(
                                categoryName
                            )
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

    const uploadPost = async () => {

        //Validate data
        if (title == undefined) {
            alert('Title is required')
        } else {
            if (selectedCategory == undefined) {
                alert('Category is required')
            } else {
                if (selectedBranch == undefined) {
                    alert('Branch is required')
                } else {
                    if (selectedStatus == undefined) {
                        alert('Status is required')

                    } else {
                        price = parseFloat(price)
                        if (price == undefined || isNaN(price)) {
                            alert('Price is required and must is positive number. ')
                        } else {
                            if (description == undefined) {
                                description = ''
                            }

                            if (listImages.length == 0) {
                                stringPath = "No image"
                            } else {
                                // //Upload Images
                                listImages.forEach(item => {
                                    let uploadUri = item
                                    let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
                                    stringPath = stringPath + fileName

                                    try {
                                        const task = storage().ref(stringPath).putFile(uploadUri)
                                        task.then(() => {
                                            console.log('Uploaded: ', uploadUri)
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                })
                            }
                            // Upload Firestore Database
                            await firestore().collection('posts').add({
                                postTitle: title,
                                postCategory: selectedCategory,
                                postBranch: selectedBranch,
                                postStatusOfProduct: selectedStatus,
                                postStatus: 0,
                                postPrice: price,
                                postDescription: description,
                                postTimestamp: Date.now(),
                                postImages: stringPath,
                                postOwner: auth().currentUser.uid,
                                postID: auth().currentUser.uid + '_' + Date.now(),
                            }).catch(error => alert(error.meesage))
                                .then(
                                    console.log('Update post successful')
                                )
                        }
                    }
                }
            }
        }
        // //Reset field
        // setTitle('')
        // setSelectedBranch(0)
        // setListImages([])
    }

    const pickImages = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            setListImages([...listImages, image.path])
            console.log(image.path)
        });
    }

    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedBranch, setSelectedBranch] = useState()
    const [selectedStatus, setSelectedStatus] = useState()

    const dataStatus = ['New', 'Used (Not maintained yet)', 'Used (Maintained)']
    const dataBranch = ['Dell', 'Acer', 'Asus', 'HP']
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <ScrollView>
                    {/* Select category */}
                    <View style={{
                        marginHorizontal: 20,
                        marginTop: 20,
                        backgroundColor: colors.primaryBackground,
                        borderRadius: 10
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            marginLeft: 10
                        }}>
                            <Text>Choose category </Text>
                            <Text style={{
                                color: 'red'
                            }}>*</Text>
                        </View>
                        <SelectDropdown data={categories}
                            defaultButtonText='Category'
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
                            onSelect={(selectedItem, index) => { setSelectedCategory(selectedItem) }}
                        />
                    </View>

                    {/* Detail Infomation */}
                    <View style={{
                        marginTop: 20,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginStart: 10
                        }}>DETAIL INFOMATION</Text>

                        {/* Take a photo */}
                        <TouchableOpacity style={styles.touchable}
                            onPress={pickImages}>
                            <Image source={require('../assets/camera.png')}
                                style={{
                                    width: 64,
                                    height: 64,
                                    alignSelf: 'center',
                                    marginTop: 10
                                }} />
                            <Text style={{
                                fontSize: 16,
                                textAlign: 'center',
                                marginBottom: 5
                            }}>Take a photo</Text>
                        </TouchableOpacity>

                        {/* Select branch */}
                        <View style={{
                            marginHorizontal: 20,
                            marginTop: 20,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={dataBranch}
                                defaultButtonText='Branch'
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
                                onSelect={(selectedItem, index) => { setSelectedBranch(selectedItem) }}
                            />
                        </View>

                        {/* Select Status */}
                        <View style={{
                            marginHorizontal: 20,
                            marginTop: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={dataStatus}
                                defaultButtonText='Status'
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
                                onSelect={(selectedItem, index) => { setSelectedStatus(selectedItem) }}
                            />
                        </View>

                        {/* Input Price */}
                        <View style={styles.inputContainer}>
                            <Input placeholder='Price'
                                keyboardType='number-pad'
                                value={price}
                                onChangeText={(text) => setPrice(text)}
                                style={{
                                    marginStart: 15
                                }} />
                        </View>
                    </View>

                    {/* Title and Description */}
                    <View style={{
                        marginTop: 20,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginStart: 10
                        }}>TITLE AND DESCRIPTION</Text>

                        {/* Input Title  */}
                        <View style={styles.inputContainer}>
                            <Input placeholder='Title'
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                style={{
                                    marginStart: 15,
                                }} />
                        </View>

                        {/* Input Description */}
                        <TextInput multiline placeholder='Detail Description'
                            height={200}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            style={{
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: colors.primaryBackground,
                                ...styles.inputContainer,
                                paddingStart: 15,
                                textAlignVertical: 'top'
                            }} />

                        {/* Button Submit  */}
                        <Button title={'Upload'}
                            containerStyle={styles.button}
                            onPress={uploadPost}
                            buttonStyle={{
                                height: 50
                            }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingBottom: 130
    },
    touchable: {
        borderColor: 'red',
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 10,
        marginHorizontal: 20,
        borderRadius: 10
    },
    inputContainer: {
        marginHorizontal: 10,
        marginTop: 10
    },
    button: {
        width: 200,
        marginTop: 10,
        alignSelf: 'center'
    }
})