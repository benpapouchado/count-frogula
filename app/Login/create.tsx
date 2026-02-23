import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomDatePicker from '../DatePicker/CustomDatePicker';
import FormInput from '../shared';


  export default function CreateAccountScreen() {

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const [date_of_birth, setDate] = useState(new Date());
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [passwordStrong, setPasswordStrong] = useState<boolean | null>(null);

    const[usernameCheckFailed, setUsernameCheckFailed] = useState(false);
    const[showUsernameCheck, setShowUsernameCheck] = useState(false);
    const[lastUsernameCheck, setLastUsernameCheck] = useState('');

    const[passwordCheckFailed, setPasswordCheckFailed] = useState(false);
    const[showPasswordCheck, setShowPasswordCheck] = useState(false);
    const[lastPasswordCheck, setLastPasswordCheck] = useState('');
    
    const[triggerAccountCreation, setTriggerAccountCreation] = useState(false);
    const [accountCreationFailed, setAccountCreationFailed] = useState(false);

    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (usernameAvailable !== null) {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      }
    }, [usernameAvailable]);

    const checkUsername = async () => {
      try {
        const response = await fetch(`${API_URL}/users/username-exists/${username}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        if(response.status === 200){
          setUsernameCheckFailed(false);
          setUsernameAvailable(json.is_available === "true" ? true : false);
          setLastUsernameCheck(username);
        } 

      } catch (error) {
        setUsernameCheckFailed(true);
        setUsernameAvailable(null);
        setLastUsernameCheck('');
      }
    };

    const checkPasswordStrength = async () => {
      try {
        const response = await fetch(`${API_URL}/users/password-is-strong/${password}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();

        if(response.status === 200){
          setPasswordCheckFailed(false);
          setPasswordStrong(json.password_is_strong === "true" ? true : false);
          setLastPasswordCheck(password);
        } 

      } catch (error) {
        setPasswordCheckFailed(true);
        setPasswordStrong(null);
        setLastPasswordCheck('');
      }
    }

    const addNewUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/create-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            username: username,
            password: password,
            date_of_birth: date_of_birth.toISOString().split('T')[0], 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log('User created:', json);

        if(response.status === 200){
          router.push('/Home/home');
        }

        if(response.status === 400 || response.status === 500){
          setAccountCreationFailed(true);
        }

      } catch (error) {
        setAccountCreationFailed(true);
      }
    };

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>

          <Text style={styles.textHeader}>Create Frog Account</Text>

          <FormInput onChangeText={setName} placeHolder={'Name'} />

          <View style={{ width: '100%'}}>
            <FormInput onChangeText={setUserName} placeHolder={'User Name'} />

            {showUsernameCheck && usernameCheckFailed && (
              <Text style={styles.usernameNull}>Failed to check username availability</Text>
            )}

            {showUsernameCheck && usernameAvailable !== null && lastUsernameCheck === username && (
              <Animated.View style={{ opacity: fadeAnim }}>
                {usernameAvailable === true && (
                  <Text style={styles.usernameAvailableText}>🟢 Username is available</Text>
                )}

                {usernameAvailable === false && (
                  <Text style={styles.usernameTakenText}>🔴 Username is already taken</Text>
                )}
              </Animated.View>
            )}
          </View>

          <Button title="Check Availability" onPress={() => {
            checkUsername();
            setShowUsernameCheck(!showUsernameCheck);
          }} />

          <View style={{ width: '100%'}}>
            <FormInput onChangeText={setPassword} placeHolder={'Password'} />

            {showPasswordCheck && passwordCheckFailed && (
              <Text style={styles.usernameNull}>Failed to check password strength</Text>
            )}

            {showPasswordCheck && passwordStrong !== null && lastPasswordCheck === password && (
              <Animated.View style={{ opacity: fadeAnim }}>
                {passwordStrong === true && (
                  <Text style={styles.usernameAvailableText}>🟢 Password is strong</Text>
                )}

                {passwordStrong === false && (
                  <Text style={styles.usernameTakenText}>🔴 Password is weak</Text>
                )}
              </Animated.View>
            )}
          </View>

          <Button title="Check Strength" onPress={() => {
            checkPasswordStrength();
            setShowPasswordCheck(!showPasswordCheck);
          }} />

          <CustomDatePicker date={date_of_birth} onDateChange={(d) => setDate(d)}/>

          <TouchableOpacity style={styles.createAccountButton} 
          onPress={() => {
            setTriggerAccountCreation(true);

            if(usernameAvailable === null){
              checkUsername();
            }

            if(passwordStrong === null){
              checkPasswordStrength();
            }

            if(usernameAvailable === true && passwordStrong === true){
            addNewUser();
          }}}>
            <Text style={styles.button}>Create Account</Text>
          </TouchableOpacity>

          {triggerAccountCreation && username === '' && (
            <Text style={styles.accountCreationFailedText}>Username is required</Text>
          )}

          {triggerAccountCreation && password === '' && (
            <Text style={styles.accountCreationFailedText}>Password is required</Text>
          )}

          {accountCreationFailed && (
            <Text style={styles.accountCreationFailedText}>Account creation failed. Perhaps username not available or password is weak. Try again!</Text>
          )}

          <Button title="Already have an account? Log In" onPress={() => router.push('/Login/login')} />

        </SafeAreaView>
      </>
    );
  }

  const styles = StyleSheet.create({
    usernameNull: {
      color: 'white',
      marginTop: 6,
      fontSize: 16,
      textAlign: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      justifyContent: 'center',
    },
    accountCreationFailedText: {
      color: '#ee5252ff',
      fontSize: 16,
      textAlign: 'center',
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
    },
    textHeader: {
      color: '#fff',
      fontSize: 30,
      paddingTop: 50,
      paddingLeft: 30,
    },
    button: {
      fontSize: 20,
      color: 'white'
    },
    createAccountButton: {
      marginLeft: 50,
      marginRight: 50,
      marginBottom: 20,
      padding: 20,
      borderRadius: 25,
      backgroundColor: "#0d8529c9",
      alignItems: 'center',
      justifyContent: 'center',
    },

    usernameAvailableText: {
      color: '#91f470ff',
      marginTop: 6,
      fontSize: 16,
      textAlign: 'center',
    },

    usernameTakenText: {
      color: '#ce6161ff',
      marginTop: 6,
      fontSize: 16,
      textAlign: 'center',
    },
  });
