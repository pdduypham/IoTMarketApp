import { SafeAreaView, ScrollView, TextInput, StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown'
import colors from '../constants/colors'
import { Button, Input } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import UploadImageItem from '../components/UploadImageItem'
import firebase from '@react-native-firebase/app'
import ViewHide from '../components/ViewHide'

const UploadScreen = ({ navigation, route }) => {

    const [categories, setCategories] = useState()
    const [loading, setLoading] = useState(true)
    let [price, setPrice] = useState()
    let [title, setTitle] = useState()
    let [description, setDescription] = useState()
    const [listImages, setListImages] = useState([])
    let stringPath = 'postsImages/' + auth().currentUser.uid + '/'
    let [disableUpload, setDisableUpload] = useState(true)
    let storageRef
    const [transferred, setTransferred] = useState(0)
    const [uploading, setUploading] = useState(false)
    const dropdownCategoryRef = useRef({})
    const dropdownBranchRef = useRef({})
    const dropdownStatusRef = useRef({})
    const time = firebase.firestore.Timestamp.now().seconds
    const displayName = firebase.auth().currentUser.displayName

    //Get Categories from db.
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

    //Disable Upload when field is empty.
    useEffect(() => {
        setDisableUpload((
            title == undefined ||
            title == '' ||
            selectedCategory == undefined ||
            selectedBranch == undefined ||
            selectedStatus == undefined ||
            price == undefined || isNaN(price) ||
            price == '' ||
            description == undefined ||
            description == ''))
    }, [description, price, selectedStatus, title, selectedCategory, selectedBranch])

    //Upload post.
    const uploadPost = () => {
        price = parseFloat(price)
        if (listImages.length == 0) {
            stringPath = "No image"
            firestore()
                .collection('posts')
                .doc(auth().currentUser.uid + '_' + time)
                .set({
                    postTitle: title,
                    postCategory: selectedCategory,
                    postBranch: selectedBranch,
                    postStatusOfProduct: selectedStatus,
                    postStatus: 0,
                    postPrice: price,
                    postDescription: description,
                    postTimestamp: time,
                    postImages: stringPath,
                    postOwner: auth().currentUser.uid,
                    postID: auth().currentUser.uid + '_' + time,
                    postDisplayName: displayName
                }).catch(error => alert(error.meesage))
                .then(
                    setUploading(false),
                    Alert.alert("Success", "Your post is uploaded!", [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.replace('TabBar', { routeName: 'Posts' })
                            }
                        }
                    ]),
                    console.log('Upload post successful with no image: ', time),
                    //Reset field
                    setTitle(undefined),
                    setListImages([]),
                    setPrice(undefined),
                    setDescription(undefined),
                    setSelectedBranch(undefined),
                    setSelectedStatus(undefined),
                    setSelectedCategory(undefined),
                    dropdownCategoryRef.current.reset(),
                    dropdownBranchRef.current.reset(),
                    dropdownStatusRef.current.reset(),
                )
        } else {
            //Upload Images
            setUploading(true)
            stringPath += time + '/'
            listImages.forEach((item, index) => {
                let uploadUri = item
                let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
                let uploadStringPath = stringPath + fileName

                try {
                    storageRef = storage().ref(uploadStringPath)
                    const task = storageRef.putFile(uploadUri)
                    task.on('state_changed', taskSnapshot => {
                        setTransferred(Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100))
                    });
                    task.then(() => {
                        console.log('Uploaded image: ', uploadUri)
                        if (index == listImages.length - 1) {
                            firestore()
                                .collection('posts')
                                .doc(auth().currentUser.uid + '_' + time)
                                .set({
                                    postTitle: title,
                                    postCategory: selectedCategory,
                                    postBranch: selectedBranch,
                                    postStatusOfProduct: selectedStatus,
                                    postStatus: 0,
                                    postPrice: price,
                                    postDescription: description,
                                    postTimestamp: time,
                                    postImages: stringPath,
                                    postOwner: auth().currentUser.uid,
                                    postID: auth().currentUser.uid + '_' + time,
                                    postDisplayName: displayName
                                }).catch(error => alert(error.meesage))
                                .then(
                                    setUploading(false),
                                    Alert.alert("Success", "Your post is uploaded!", [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                navigation.replace('TabBar', { routeName: 'Posts' })
                                            }
                                        }
                                    ]),
                                    console.log('Update post successful with images'),
                                    //Reset field
                                    setTitle(undefined),
                                    setListImages([]),
                                    setPrice(undefined),
                                    setDescription(undefined),
                                    setSelectedBranch(undefined),
                                    setSelectedStatus(undefined),
                                    setSelectedCategory(undefined),
                                    dropdownCategoryRef.current.reset(),
                                    dropdownBranchRef.current.reset(),
                                    dropdownStatusRef.current.reset(),
                                )
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            })
        }
    }

    //Pick Image from Camera.
    const pickImages = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then(item => {
            setListImages([...listImages, item.path])
        });
    }

    //Get and Delete image from child component.
    let getData = (childData) => {
        const new_arr = listImages.filter(item => item !== childData);
        setListImages(new_arr)
    }

    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedBranch, setSelectedBranch] = useState()
    const [selectedStatus, setSelectedStatus] = useState()

    //Data.
    const dataStatus = ['New', 'Used (Not maintained yet)', 'Used (Maintained)']
    const dataBranch = ['Dell', 'Acer', 'Asus', 'HP']

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <ScrollView>
                    {/* Detail Infomation */}
                    <View style={{
                        marginTop: 10,
                    }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginLeft: 10
                        }}>DETAIL INFOMATION</Text>

                        {/* Take a photo */}
                        <TouchableOpacity style={styles.touchable}
                            onPress={pickImages}
                            disabled={listImages.length == 5 ? true : false}>
                            <Image source={require('../assets/camera.png')}
                                style={{
                                    width: 64,
                                    height: 64,
                                    alignSelf: 'center',
                                    marginTop: 5
                                }} />
                            <Text style={{
                                fontSize: 16,
                                textAlign: 'center',
                                marginBottom: 5
                            }}>Take a photo: {listImages.length}/5</Text>
                        </TouchableOpacity>
                        {listImages.length > 0 && <View style={{
                            height: 80,
                            marginTop: 5,
                            marginLeft: 10,
                        }}>
                            <ScrollView horizontal>
                                {listImages.map(item => <UploadImageItem onPress={getData} key={item} imageURI={item} />)}
                            </ScrollView>
                        </View>}

                        {/* Select category */}
                        <View style={{
                            marginHorizontal: 10,
                            marginTop: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={categories}
                                defaultButtonText='Category'
                                ref={dropdownCategoryRef}
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
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>

                        {/* Select branch */}
                        <View style={{
                            marginHorizontal: 10,
                            marginTop: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={dataBranch}
                                defaultButtonText='Branch'
                                ref={dropdownBranchRef}
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
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>

                        {/* Select Status */}
                        <View style={{
                            marginHorizontal: 10,
                            marginTop: 10,
                            backgroundColor: colors.primaryBackground,
                            borderRadius: 10
                        }}>
                            <SelectDropdown data={dataStatus}
                                defaultButtonText='Status'
                                ref={dropdownStatusRef}
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
                                dropdownStyle={{
                                    borderRadius: 10,
                                }}
                            />
                        </View>

                        {/* Input Price */}
                        <View>
                            <Input placeholder='Price'
                                keyboardType='number-pad'
                                value={price}
                                renderErrorMessage={false}
                                onChangeText={(text) => setPrice(text)}
                                inputContainerStyle={{
                                    paddingLeft: 10,
                                    borderWidth: 2,
                                    borderColor: colors.primaryBackground,
                                    borderRadius: 10,
                                    marginTop: 10
                                }} />
                        </View>
                    </View>

                    {/* Title and Description */}
                    <View>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginLeft: 10,
                        }}>TITLE AND DESCRIPTION</Text>

                        {/* Input Title  */}
                        <View>
                            <Input placeholder='Title'
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                renderErrorMessage={false}
                                inputContainerStyle={{
                                    paddingLeft: 10,
                                    borderWidth: 2,
                                    borderColor: colors.primaryBackground,
                                    borderRadius: 10,
                                    marginBottom: 10
                                }} />
                        </View>

                        {/* Input Description */}
                        <Input multiline placeholder='Detail Description'
                            height={200}
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            inputContainerStyle={{
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: colors.primaryBackground,
                                textAlignVertical: 'top',
                                paddingLeft: 10
                            }} />

                        {/* Button Submit  */}
                        {uploading == false ? (<Button title={'Upload'}
                            disabled={disableUpload}
                            containerStyle={styles.button}
                            onPress={uploadPost}
                            buttonStyle={{
                                height: 50,
                            }} />)
                            : (
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 100
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        marginTop: 10
                                    }}>{transferred}% completed</Text>
                                    <ActivityIndicator size='large' color={colors.primary} />
                                </View>
                            )}
                    </View>
                </ScrollView>
                <ViewHide />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    touchable: {
        borderColor: 'red',
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10
    },
    inputContainer: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    button: {
        width: 200,
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 100,
        borderRadius: 10
    }
})