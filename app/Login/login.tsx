import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from '../shared';


export default function LoginScreen() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const router = useRouter();

    const login = async () => {

    try {
        const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(btoa(username) + ':' + btoa(password)),
        },
    });

    if(response.status === 401){
        setLoginFailed(true);
    }

    const json = await response.json();
    console.log('Successful login', json);

    if(response.status === 200){
        router.push('/Home/home')
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

                <Button title="Forgot Password? Reset it here"
                    onPress={() => router.push('/Login/forgot_password')} />

                <TouchableOpacity style={styles.createAccountButton} onPress={login}>
                    <Text style={styles.button}>Login</Text>
                </TouchableOpacity>

                {loginFailed && (
                    <Text style={styles.loginFailedText}>And I oop! Login failed. Please check your credentials.</Text>
                )}

                <Button title="Don't have an account yet? Create one here"
                    onPress={() => router.push('/Login/create')} />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    loginFailedText: {
        color: '#ee5252ff',
        fontSize: 16,
        textAlign: 'center',
    },
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