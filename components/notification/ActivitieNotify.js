import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firebase from '@react-native-firebase/app'
import NotifyItem from './NotifyItem'

const ActivitieNotify = ({ navigation }) => {

    const curUserInfo = firebase.auth().currentUser
    const [notifies, setNotifies] = useState([])

    useEffect(() => {
        let list = []
        const fetchNotifies = async () =>
            await firebase.firestore()
                .collection('users')
                .doc(curUserInfo.uid)
                .collection('notifies')
                .get()
                .then((docs) => {
                    docs.forEach((doc) => doc.data().notifyType && list.push({ data: doc.data(), id: doc.id }))
                    setNotifies(list)
                })
        fetchNotifies()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {notifies.map((notify) => (
                    <NotifyItem key={notify.id}
                        data={notify.data}
                        navigation={navigation} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ActivitieNotify

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    }
})