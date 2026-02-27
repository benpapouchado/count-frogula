// import styles from 'app/frog.css';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Button, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FormInput from '../shared';

export default function ForgotPasswordScreen() {

    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();

    const[username, setUsername] = useState('');
    const[usernameCheckFailed, setUsernameCheckFailed] = useState(false);
    const[userExists, setUserExists] = useState<boolean | null>(null);

    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');

    const[passwordCheckFailed, setPasswordCheckFailed] = useState(false);
    const[passwordStrong, setPasswordStrong] = useState<boolean | null>(null);

    const[enterCode, setEnterCode] = useState(false);
    const[code, setCode] = useState('');

    const[id, setId] = useState();

        //OTP input handling
    const [OTPcode, setOTPCode] = useState(["", "", "", ""]);

        const inputs : any = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        ];

        const handleChange = (text : string, index : number) => {
        if (!/^\d?$/.test(text)) return; // allow only 1 digit

        const newCode = [...OTPcode];
        newCode[index] = text;
        setOTPCode(newCode);

        // Move to next input if filled
        if (text && index < 3) {
            inputs[index + 1].current.focus();
        }
        };

        const handleKeyPress = (e : any, index : number) => {
        if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputs[index - 1].current.focus();
        }
        };

    const fetchCode = async () => {
        try {
            const response = await fetch(`${API_URL}/users/update-password-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(btoa(username) + ':' + btoa(password) + ':' + btoa(confirmPassword)),
                },
            });

            const json = await response.json();

            if(response.status === 200){
                setEnterCode(true);
                setCode(json.code);
                setId(json.id);
                setUsernameCheckFailed(false);
                setUserExists(true);
                setPasswordCheckFailed(false);
                setPasswordStrong(true);
            } 

            if(response.status === 404) {
                setUserExists(false);
                setUsernameCheckFailed(false);
            }

            if(response.status === 400) {
                setPasswordCheckFailed(true);
                setPasswordStrong(false);
                setUsernameCheckFailed(false);
            }

        } catch (error) {
            setUsernameCheckFailed(true);
        }
    };

    const checkCode = async () => {
        try {
            const response = await fetch(`${API_URL}/users/update-password/${id}/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(btoa(username) + ':' + btoa(password)), 
                },
                body: JSON.stringify({
                    id: id,
                    code: OTPcode.join(''),
                }),
            });

            const json = await response.json();
            console.log(json);

            if(response.status === 200){
                setEnterCode(false);
                setUsernameCheckFailed(false);
                setUserExists(true);
                setPasswordCheckFailed(false);
                setPasswordStrong(true);
            }

            if(response.status === 404) {
                setUserExists(false);
                setUsernameCheckFailed(false);
            }

            if(response.status === 400) {
                setPasswordCheckFailed(true);
                setPasswordStrong(false);
                setUsernameCheckFailed(false);
            }   
        } catch (error) {
            setUsernameCheckFailed(true);
        }
    };            
        

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                <Text style={styles.textHeader}>Forgot Password</Text>
                <Text style={styles.text}>Enter your username to reset your password</Text>

                <FormInput onChangeText={setUsername} placeHolder={'Username'} />
                <FormInput onChangeText={setPassword} placeHolder={'New Password'} />
                <FormInput onChangeText={setConfirmPassword} placeHolder={'Confirm New Password'} />

                <TouchableOpacity style={styles.forgotPasswordButton} onPress={fetchCode}>
                    <Text style={styles.button}>Reset Password</Text>
                </TouchableOpacity>

                {usernameCheckFailed && (
                    <Text style={styles.errorText}>Can't change password at this time</Text>
                )}

                {enterCode && (
                    <KeyboardAvoidingView>
                    <SafeAreaProvider>
                        <SafeAreaView style={styles.centeredView}>
                            
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={enterCode}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.text}>Enter the code to reset your password</Text>
                            
                                <Text style={styles.codeView}>{code}</Text>

                                <View style={styles.boxContainer}>
                                    {OTPcode.map((digit : string, index : number) => (
                                        <View key={index} style={styles.box}>
                                    <TextInput
                                        key={index}
                                        ref={inputs[index]}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        style={styles.boxText}
                                        autoFocus={index === 0}>

                                        </TextInput>
                                    </View>
                                    ))}
                                </View>

                            <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => {
                                if(code === OTPcode.join('')){          
                                    setEnterCode(false);
                                    checkCode();
                                } else {
                                    console.log(OTPcode.join(''), code);
                                }
                            }}>
                                <Text style={styles.button}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                        
                    </Modal>
                    
                    </SafeAreaView>
                    </SafeAreaProvider>
                    </KeyboardAvoidingView>
                )}

                {userExists === false && (
                    console.log('Username not found'),
                    <Text style={styles.errorText}>Frog does not exist. Click below to create account</Text>
                )}

                {password !== confirmPassword && (
                    console.log('Passwords do not match'),
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {passwordStrong === false && (
                    console.log('Password is weak'),
                    <Text style={styles.errorText}>Password is weak. Must be at least 8 characters, contain an uppercase letter, a lowercase letter, a number, and a special character.</Text>
                )}
                
                {userExists === true && password === confirmPassword && enterCode === true && (
                    <Text style={styles.text}>Enter the code to confirm password reset</Text>
                )}

                {OTPcode.join('') !== code && OTPcode.join('').length === 4 && (
                    console.log('Incorrect code'),
                    <Text style={styles.errorText}>Incorrect code. Please try again.</Text>
                )}

                {OTPcode.join('') === code && code !== '' && (
                    console.log('Code correct'),
                    <Text style={styles.text}>Code correct! Your password has been reset.</Text>
                )}
                
                <Button title="Back to Login"
                    onPress={() => router.push('/Login/login')} />                                
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
        paddingRight: 30,

    },
    forgotPasswordButton: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 15,
        padding: 20,
        borderRadius: 25,
        backgroundColor: "#0d8529c9",
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#ee5252ff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    modalContainer: {  
    margin: 20,
    backgroundColor: '#383434ff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
        },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    },
    codeView:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
    },
    boxContainer: {
        flexDirection: 'row',
        margin: 20,
        borderRadius: 10,
    },
    box: {
        width: 50,
        height: 60,
        borderWidth: 1,
        borderColor: '#fff',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    boxText: {
        fontSize: 24,
        color: '#fff',
    },  
});