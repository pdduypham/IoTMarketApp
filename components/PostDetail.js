import { ScrollView, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Modal, Animated, Easing, Alert } from 'react-native'
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import colors from '../constants/colors'
import fonts from '../constants/fonts'
import { Avatar, Card } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import Carousel from 'react-native-anchor-carousel';
import BottomMenu from './BottomMenu'
import ViewHide from './ViewHide'
import PostItem from './PostItem'
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context'
import { SimplePaginationDot } from './SimplePaginationDot';

const PostDetail = ({ navigation, route }) => {

    const [listImages, setListImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [time, setTime] = useState('')
    const [timeOnline, setTimeOnline] = useState('')
    const [online, setOnline] = useState('')
    const [posts, setPosts] = useState([])
    const [like, setLike] = useState(false)
    const [visible, setVisible] = useState(false)
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stateOptionsOwner, setStateOptionsOwner] = useState([])

    function handleCarouselScrollEnd(item, index) {
        setCurrentIndex(index);
    }

    const dataPost = {
        postID: route.params.postID,
        postBranch: route.params.postBranch,
        postCategory: route.params.postCategory,
        postDescription: route.params.postDescription,
        postStatus: route.params.postImages,
        postPrice: route.params.postPrice,
        postStatusOfProduct: route.params.postStatusOfProduct,
        postTitle: route.params.postTitle,
        postStatus: route.params.postStatus,
        postReason: route.params.postReason,
        postImages: route.params.postImages,
        postDisplayName: route.params.postDisplayName,
        postOwner: route.params.postOwner
    }

    const curUserUID = firebase.auth().currentUser.uid
    const scale = useRef(new Animated.Value(0)).current
    let optionsOwner = [
        {
            title: 'Edit',
            icon: require('../assets/edit.png'),
            action: () => {
                navigation.navigate('Update', { dataPost })
            }
        },
        {
            title: 'Sold/Hide',
            icon: require('../assets/hide.png'),
            action: () => {
                Alert.alert('Confirm', 'Would you like to confirm that this product has been sold?', [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        style: 'default',
                        onPress: async () => {
                            await firebase.firestore()
                                .collection('posts')
                                .doc(route.params.postID)
                                .update({
                                    postStatus: 3
                                })
                                .then(() => {
                                    navigation.replace('TabBar', { routeName: 'Posts', name: 'Sold' })
                                })
                        }
                    }
                ])
            }
        },
        {
            title: 'Delete',
            icon: require('../assets/delete.png'),
            action: () => {
                Alert.alert('Delete', 'Are you sure you want to delete this post?', [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Delete',
                        style: 'default',
                        onPress: async () => {
                            if (route.params.postImages != 'No image') {
                                await firebase.storage()
                                    .ref(route.params.postImages)
                                    .listAll()
                                    .then((docs) => {
                                        docs.items.forEach((doc) => {
                                            firebase.storage()
                                                .ref(route.params.postImages + '/' + doc.name)
                                                .delete()
                                        })
                                        firebase.firestore()
                                            .collection('posts')
                                            .doc(route.params.postID)
                                            .delete()
                                            .then(() => {
                                                navigation.navigate('TabBar')
                                            })
                                    })
                            } else {
                                firebase.firestore()
                                    .collection('posts')
                                    .doc(route.params.postID)
                                    .delete()
                                    .then(() => {
                                        navigation.navigate('TabBar')
                                    })
                            }
                        }
                    }
                ])
            }
        },
    ]

    //Customize Options due to Post Status
    useEffect(() => {
        if (dataPost.postStatus == 0) {
            optionsOwner.splice(1, 1)
        } else if (dataPost.postStatus == 1) {
            optionsOwner.splice(0, 1)
        }
        setStateOptionsOwner(optionsOwner)
    }, [route])

    const optionsViewer = [
        {
            title: 'Report',
            icon: require('../assets/warning.png'),
            action: () => alert('report')
        },
    ]

    //Convert time
    useEffect(() => {
        let temp = (firebase.firestore.Timestamp.now().seconds - route.params.postTimestamp)
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

    useEffect(() => {
        let temp = (firebase.firestore.Timestamp.now().seconds - online)
        if (temp < 120) {
            setTimeOnline('Just now')
        } else if (temp >= 120 && (temp / 60 / 60) < 1) {
            setTimeOnline((temp / 60).toFixed(0) + ' minutes ago')
        } else if ((temp / 60 / 60) >= 1 && (temp / 60 / 60) < 2) {
            setTimeOnline('1 hour ago')
        } else if ((temp / 60 / 60) >= 2 && (temp / 60 / 60 / 24) < 1) {
            setTimeOnline((temp / 60 / 60).toFixed(0) + ' hours ago')
        } else if ((temp / 60 / 60 / 24) >= 1 && (temp / 60 / 60 / 24) < 2) {
            setTimeOnline('1 day ago')
        } else {
            setTimeOnline((temp / 60 / 60 / 24).toFixed(0) + ' days ago')
        }
    })

    //Add or Remove Favourite Post
    const favouriteFucntion = () => {
        setLike(!like)
        const addToDB = async () =>
            !like ?
                await firebase.firestore()
                    .collection('users')
                    .doc(curUserUID)
                    .collection('favourites')
                    .doc(route.params.postID)
                    .set({
                        postID: route.params.postID
                    })
                    .then(() => {
                        Toast.show('Added to your favourite!', Toast.SHORT)
                    })
                : await firebase.firestore()
                    .collection('users')
                    .doc(curUserUID)
                    .collection('favourites')
                    .doc(route.params.postID)
                    .delete()
                    .then(() => {
                        Toast.show('Removed from your favourite!', Toast.SHORT)
                    })
        addToDB()
    }

    //Fetch Favourite
    useEffect(() => {
        const fetchFavourite = async () =>
            await firebase.firestore()
                .collection('users')
                .doc(curUserUID)
                .collection('favourites')
                .doc(route.params.postID)
                .get()
                .then((data) => {
                    if (data.get('postID') != undefined) {
                        setLike(true)
                    } else {
                        setLike(false)
                    }
                })
        fetchFavourite()
    }, [route, like])

    //Navigation header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: 'white',
            headerShown: true,
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 5,
                }}>
                    {dataPost.postStatus == 1 && <TouchableOpacity
                        onPress={favouriteFucntion}
                        style={styles.topMenu}>
                        <Image source={require('../assets/heart.png')}
                            resizeMethod='resize'
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: like ? 'red' : 'white',
                            }} />
                    </TouchableOpacity>}

                    {dataPost.postStatus == 1 &&
                        <TouchableOpacity
                            onPress={() => resizeBox(1)}
                            style={styles.topMenu}>
                            <Image source={require('../assets/more_vertical.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: 'white'
                                }} />
                        </TouchableOpacity>}

                    {dataPost.postStatus == 0 &&
                        <TouchableOpacity
                            onPress={() => resizeBox(1)}
                            style={styles.topMenu}>
                            <Image source={require('../assets/more_vertical.png')}
                                resizeMethod='resize'
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: 'white'
                                }} />
                        </TouchableOpacity>}
                </View>
            ),
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    }, [navigation, like])

    //Fetch Images
    useEffect(() => {
        const fetchImages = async () => {
            if (route.params.postImages != 'No image') {
                const imageRef = await firebase.storage().ref(route.params.postImages).listAll()
                const urls = await Promise.all(imageRef.items.map(ref => ref.getDownloadURL()))
                return urls
            }
        }

        const loadImages = async () => {
            const urls = await fetchImages();
            setListImages(urls);
            setLoading(false)
        }
        loadImages();
    }, [])

    //Check onlineStatus
    useEffect(() => {
        const checkOnlineStatus = async () =>
            await firebase.firestore()
                .collection('users')
                .doc(route.params.postOwner)
                .get()
                .then(data => {
                    setOnline(data.get('onlineStatus'))
                })

        checkOnlineStatus()
    })

    //Fetch Product Same Category
    useEffect(() => {
        const fetchProduct = async () =>
            await firebase.firestore()
                .collection('posts')
                .where('postCategory', '==', dataPost.postCategory)
                .where('postID', '!=', dataPost.postID)
                .where('postStatus', 'in', [1])
                .limit(10)
                .get()
                .then(dataDocs => {
                    setPosts(dataDocs.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data()
                    })))
                })
        fetchProduct()
    }, [route])

    const detailPost = (postStatus, postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages) => {
        navigation.navigate("PostDetail", { postStatus, postID, postTimestamp, postBranch, postCategory, postDescription, postStatusOfProduct, postDisplayName, postTitle, postPrice, postOwner, postImages })
    }

    //Animated for Popup Menu
    function resizeBox(to) {
        to === 1 && setVisible(true)
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 150,
            easing: Easing.linear,
        }).start(() => to === 0 && setVisible(false))
    }

    //Alert for Rejected Post
    useEffect(() => {
        dataPost.postStatus == 2 &&
            Alert.alert('Warning', `This post was rejected because:\n${dataPost.postReason}`)
    }, [route])

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent visible={visible}>
                <SafeAreaView style={{
                    flex: 1
                }} onTouchStart={() => resizeBox(0)}>
                    <Animated.View style={[styles.popupMenu, {
                        transform: [{ scale }]
                    }]}>
                        {curUserUID == route.params.postOwner ? stateOptionsOwner.map((op, i) => (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingVertical: 5,
                                    borderBottomWidth: i === stateOptionsOwner.length - 1 ? 0 : 1
                                }}
                                onPress={op.action}>
                                <Text style={{
                                    fontFamily: fonts.normal
                                }}>{op.title}</Text>
                                <Image source={op.icon}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginLeft: 10,
                                        tintColor: op.title == 'Delete' ? 'red' :
                                            op.title == 'Edit' ? 'orange' : 'green'
                                    }} />
                            </TouchableOpacity>
                        ))
                            : optionsViewer.map((op, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingVertical: 5,
                                        borderBottomWidth: i === optionsViewer.length - 1 ? 0 : 1
                                    }}
                                    onPress={op.action}>
                                    <Text style={{
                                        fontFamily: fonts.normal
                                    }}>{op.title}</Text>
                                    <Image source={op.icon}
                                        resizeMethod='resize'
                                        resizeMode='contain'
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginLeft: 10
                                        }} />
                                </TouchableOpacity>
                            ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>

            <ScrollView>
                {loading || route.params.postImages == 'No image' ?
                    <View style={{
                        marginRight: 10
                    }}>
                        <Image source={require('../assets/logo.jpg')}
                            resizeMethod='scale'
                            resizeMode='contain'
                            style={{
                                width: '100%',
                                height: 250,
                                flex: 1,
                                borderRadius: 10,
                                elevation: 3,
                            }} />
                    </View>
                    : listImages.length == 1 ?
                        <View style={{
                            marginRight: 10
                        }}>
                            <Image source={{ uri: listImages[0] }}
                                resizeMethod='scale'
                                resizeMode='contain'
                                style={{
                                    width: '100%',
                                    height: 250,
                                    flex: 1,
                                    borderRadius: 10,
                                    elevation: 3,
                                }} />
                        </View>
                        : <View>
                            <Carousel
                                data={listImages}
                                style={{
                                    marginBottom: 10
                                }}
                                initialIndex={0}
                                ref={carouselRef}
                                onScrollEnd={handleCarouselScrollEnd}
                                itemWidth={Dimensions.get('window').width * 0.88}
                                containerWidth={Dimensions.get('window').width * 0.95}
                                separatorWidth={2}
                                inActiveOpacity={0.5}
                                onSnapToItem={index => setIndex(index)}
                                renderItem={({ item }) =>
                                    <View>
                                        <Image source={{ uri: item }}
                                            resizeMethod='scale'
                                            resizeMode='contain'
                                            style={{
                                                width: '100%',
                                                height: 250,
                                                flex: 1,
                                                borderRadius: 10,
                                                elevation: 3,
                                            }} />
                                    </View>
                                } />
                            <SimplePaginationDot currentIndex={currentIndex} length={listImages.length} />
                        </View>
                }

                {dataPost.postStatus == 2 && <Card containerStyle={styles.cardContainer}>
                    <View>
                        <Text style={{
                            fontFamily: fonts.bold
                        }}>This post was rejected because: </Text>
                        <Text style={{
                            fontFamily: fonts.light,
                            color: 'red'
                        }}>{dataPost.postReason}</Text>
                    </View>
                </Card>}

                <Card containerStyle={styles.cardContainer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Avatar rounded size={64}
                            source={require('../assets/logo.jpg')}
                            avatarStyle={{
                                borderWidth: 1,
                                borderColor: colors.primaryBackground
                            }}
                        />

                        {online == 'online' ? <Image
                            source={require('../assets/online.png')}
                            style={{
                                width: 16,
                                height: 16,
                                position: 'absolute',
                                left: 45,
                                top: 45
                            }} />
                            : <Image source={require('../assets/offline.png')}
                                style={{
                                    width: 16,
                                    height: 16,
                                    position: 'absolute',
                                    left: 45,
                                    top: 45
                                }} />}

                        <View style={{
                            flexDirection: 'column'
                        }}>
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 16,
                                marginLeft: 5
                            }}>{route.params.postDisplayName}</Text>

                            {online == 'online' ? <Text
                                style={{
                                    marginLeft: 5,
                                }}>Online</Text>
                                : <Text style={{
                                    marginLeft: 5
                                }}>{timeOnline}</Text>}
                        </View>
                        <View style={{
                            flex: 1
                        }} />
                        {dataPost.postStatus == 1 &&
                            <TouchableOpacity
                                onPress={favouriteFucntion}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 5,
                                    borderWidth: 2,
                                    padding: 5,
                                    borderRadius: 10,
                                    borderColor: like ? 'red' : colors.primary
                                }}>
                                {!like ? <Text>Add  </Text>
                                    : <Text>Remove  </Text>}
                                <Image source={require('../assets/heart.png')}
                                    resizeMethod='resize'
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: like ? 'red' : colors.primary
                                    }} />
                            </TouchableOpacity>}
                    </View>
                </Card>

                <View style={{
                    flex: 1,
                    marginBottom: route.params.postStatus == 1 ? 80 : 15
                }}>
                    <Card containerStyle={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                fontFamily: fonts.bold,
                                fontSize: 20,
                                marginTop: 5
                            }}>{route.params.postTitle}</Text>
                            <View style={{
                                flex: 1
                            }} />
                            <Image source={require('../assets/clock.png')}
                                style={{
                                    width: 14,
                                    height: 14,
                                    marginRight: 5
                                }} />
                            <Text style={{
                                marginRight: 5
                            }}>{time}</Text>
                        </View>

                        <Text style={{
                            fontFamily: fonts.normal,
                            fontSize: 16,
                            color: 'red'
                        }}>{route.params.postPrice} đ</Text>
                    </Card>

                    <Card containerStyle={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={styles.textContainer}>Category: </Text>
                            <Text>{route.params.postCategory}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={styles.textContainer}>Branch: </Text>
                                <Text>{route.params.postBranch}</Text>
                            </View>

                            <View style={{
                                flex: 1
                            }} />

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={styles.textContainer}>Status: </Text>
                                <Text style={{
                                    marginRight: 5
                                }}>{route.params.postStatusOfProduct}</Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                            }}>{route.params.postDescription}</Text>
                        </View>
                    </Card>

                    {dataPost.postStatus == 1 && <View style={{
                        marginTop: 10
                    }}>
                        <Text style={{
                            fontFamily: fonts.bold
                        }}>Same Category</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {posts.map(({ id, data: { postTitle,
                                postPrice,
                                postTimestamp,
                                postImages,
                                postID,
                                postOwner,
                                postDisplayName,
                                postBranch,
                                postCategory,
                                postDescription,
                                postStatusOfProduct,
                                postStatus } }) => (
                                postStatus == 1 && <PostItem key={id}
                                    postTitle={postTitle}
                                    postPrice={postPrice}
                                    postTimestamp={postTimestamp}
                                    postImages={postImages}
                                    postID={postID}
                                    onPress={detailPost}
                                    postOwner={postOwner}
                                    postDisplayName={postDisplayName}
                                    postBranch={postBranch}
                                    postCategory={postCategory}
                                    postDescription={postDescription}
                                    postStatusOfProduct={postStatusOfProduct}
                                    postStatus={postStatus} />
                            ))}
                        </ScrollView>
                    </View>}
                </View>

            </ScrollView>

            {route.params.postStatus == 1 && <ViewHide />}

            {route.params.postStatus == 1 && <BottomMenu navigation={navigation} data={dataPost} />}

        </SafeAreaView>

    )
}

export default PostDetail

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        paddingLeft: 10,
        flex: 1
    },

    textContainer: {
        fontFamily: fonts.normal
    },
    cardContainer: {
        marginTop: 10,
        marginLeft: 0,
        marginRight: 10,
        borderRadius: 10,
        padding: 10
    },
    topMenu: {
        width: 50,
        height: '100%',
        alignItems: 'flex-end'
    },
    popupMenu: {
        borderRadius: 10,
        borderColor: colors.primaryBackground,
        borderWidth: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 55,
        right: 10
    },
})