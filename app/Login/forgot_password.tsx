// import styles from 'app/frog.css';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                <Text style={styles.textHeader}>Forgot Password</Text>
                <Text style={styles.text}>Please contact support to reset your password.</Text>
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
    textHeader: {
        color: '#fff',
        fontSize: 30,
        alignItems: 'center',
        paddingTop: 50,
        paddingLeft: 30,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 30,
    }
});