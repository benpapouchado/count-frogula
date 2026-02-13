import { router, Stack } from 'expo-router';
import React from 'react';
// import { eye } from 'react-icons-kit/feather/eye';
// import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>

                <View>
                    <Text style={styles.textHeader}>Welcome to Count Frogula</Text>
                </View>

                <View>
                    <Text style={styles.staticText}>Create an account to get started or log back in</Text>
                </View>

                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.navigate('/Login/create')}>
                    <Text style={styles.button}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.navigate('/Login/login')}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'flex-start',
    },
    button: {
        fontSize: 20,
        fontFamily: 'Poppins',
        color: 'white'
    },
    staticText: {
        color: '#fff',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginLeft: 10,
        marginRight: 10,
        fontFamily: 'Poppins',
    },
    textHeader: {
        color: '#fff',
        fontSize: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingLeft: 30,
    },
    createAccountButton: {
        margin: 20,
        padding: 20,
        borderRadius: 25,
        backgroundColor: "#0d8529c9",
        alignItems: 'center',
        justifyContent: 'center',
    }
});