import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from '../shared';


export default function LoginScreen() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const [username, setUserName] = useState('username');
    const [password, setPassword] = useState('password');
    const router = useRouter();

    const login = async () => {

    try {
        const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    console.log('Successful login', json);

    if(json.status === '200'){
        router.push('/Home/homescreen')
    }

    } catch (error) {
        console.error('Fetch error:', error);
    }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>

                <Text style={styles.textHeader}>Login to your Account</Text>

                <FormInput placeHolder={'Username'} onChangeText={setUserName} />
                <FormInput placeHolder={'Password'} onChangeText={setPassword} />

                <TouchableOpacity style={styles.createAccountButton} onPress={login}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>

                <Button title="Don't have an account yet? Create one here"
                    onPress={() => router.push('/Login/create')} />
            </SafeAreaView>
        </>
    );
}
//curl -X POST -H "Content-Type: application/json" -d '{"username":"Penicillin", "password":"F349jgxn*448"}' http://192.168.68.103:8080/users/login
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