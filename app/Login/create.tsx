import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomDatePicker from '../DatePicker/CustomDatePicker';
import FormInput from '../shared';

export default function CreateAccountScreen() {

  const API_URL = process.env.EXPO_PUBLIC_API_URL;


  const [date_of_birth, setDate] = useState(new Date());
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [password, setPassword] = useState('password');
  const [email, setEmail] = useState('');

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
      setUsernameAvailable(!json.taken);

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
          firstname: firstname,
          lastname: lastname,
          username: username,
          password,
          email,
          date_of_birth: date_of_birth.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log('User created:', json);


    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>

        <Text style={styles.textHeader}>Create Frog Account</Text>

        <FormInput onChangeText={setFirstName} placeHolder={'First Name'} />
        <FormInput onChangeText={setLastName} placeHolder={'Last Name'} />

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
        <FormInput onChangeText={setEmail} placeHolder={'Email'} />

        <CustomDatePicker date={date_of_birth.toDateString()} />

        <TouchableOpacity style={styles.createAccountButton} onPress={addNewUser}>
          <Text style={styles.button}>Create Account</Text>
        </TouchableOpacity>

        <Button title="Already have an account? Log In" onPress={() => router.push('/Login/login')} />

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
