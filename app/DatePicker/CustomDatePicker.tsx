import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import React from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';

export interface IProps {
  date?: string;
  placeholder?: string;
}

export interface IState {
  dateString: string;
  date: Date;
  show: boolean;
}

class CustomDatePicker extends React.Component<IProps, IState> {
  state = {
    dateString: moment(new Date()).format('YYYY-MM-DD'),
    date: this.props.date ? new Date(this.props.date) : new Date(),
    show: false
  };

  onChange = (event: any, selectedDate: any) => {
    console.log(selectedDate)
    this.setState({dateString: moment(selectedDate).format('YYYY-MM-DD'), date: selectedDate})
  }

  render() {
    return (
      <View style={{ flex: 1, borderRadius: 100,  width: '100%' }}> 
        <TouchableOpacity style={styles.inputContainerStyle}>
            
            <DateTimePicker
              value={this.state.date}
              mode={'date'}
              is24Hour={true}
              display="default"
              onChange={this.onChange}
              style = {{width: 320, backgroundColor: '#3a3f45', }}
            />
            
        </TouchableOpacity>     
        
        <Button title="Select Date of Birth" onPress={() => console.log("Date")} />

      </View>
    );
  } 
};
export default CustomDatePicker;
const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1, 
    width: '100%', 
    justifyContent: 'center',  
    backgroundColor: '#00000066',
  },

 inputContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CAD3DF',
    fontSize: 16,
    borderRadius: 15,
    margin: 12,
    marginLeft: 30,
    marginRight: 30,
    paddingRight: 10,
    height: 50,
    color: '#3a3f45',
    backgroundColor: '#3a3f45',
  },
  placeholderStyle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#CDCDCD',
    marginHorizontal: 10,
  },
  textStyle: {
    fontFamily: 'Poppins',
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  }
})