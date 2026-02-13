import { StyleSheet, TextInput, View } from 'react-native';

interface FormInputProps {
    placeHolder: string;
    onChangeText: (text: string) => void;
}

export default function FormInput({ placeHolder, onChangeText }: FormInputProps) {
    return ( 
            <View>      
              <TextInput onChangeText={onChangeText} 
              style={styles.input}
              secureTextEntry={placeHolder === 'Password' ? true : false}
              placeholder={placeHolder}
              placeholderTextColor="#625f5fff"/>
            </View>
);}

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 12,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    paddingLeft: 20,
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Poppins',
    borderRadius: 15,
    borderColor: '#fff',
    backgroundColor: '#3a3f45',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  });