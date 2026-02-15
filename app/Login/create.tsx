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
          setUsernameAvailable(json.is_available);
        } else {
          setUsernameAvailable(null);
        }

      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

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
          router.push('/Home/homescreen')
        }

        if(response.status === 400 || response.status === 500){
          setAccountCreationFailed(true);
        }

      } catch (error) {
        console.error('Fetch error:', error);
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

            {usernameAvailable !== null && (
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

          <Button title="Check Availability" onPress={checkUsername} />

          <FormInput onChangeText={setPassword} placeHolder={'Password'} />

          <CustomDatePicker date={date_of_birth} onDateChange={(d) => setDate(d)}/>

          <TouchableOpacity style={styles.createAccountButton} 
          onPress={() => {
            setTriggerAccountCreation(true);
            if(usernameAvailable === true){
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
            <Text style={styles.accountCreationFailedText}>Account creation failed. Please try again.</Text>
          )}

          <Button title="Already have an account? Log In" onPress={() => router.push('/Login/login')} />

        </SafeAreaView>
      </>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      justifyContent: 'center',
    },
    accountCreationFailedText: {
      color: '#ee5252ff',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 10,
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
      margin: 50,
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
