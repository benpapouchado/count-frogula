import { router, Stack } from 'expo-router';
import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from '../shared';


export default function LoginScreen() {

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>

                <Text style={styles.textHeader}>Login to your Account</Text>

                <FormInput placeHolder={'Username'} onChangeText={() => { }} />
                <FormInput placeHolder={'Password'} onChangeText={() => { }} />

                <TouchableOpacity style={styles.createAccountButton}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>

                <Button title="Don't have an account yet? Create one here"
                    onPress={() => router.navigate('/Login/create')} />
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
    createAccountButton: {
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 20,
        padding: 20,
        borderRadius: 25,
        backgroundColor: "#0d8529c9",
        alignItems: 'center',
        justifyContent: 'center',
    }
});