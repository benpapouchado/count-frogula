  import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

  export interface IProps {
    date?: Date;
    placeholder?: string;
    onDateChange?: (date: Date) => void;
  }

  export interface IState {
    date: Date;
    show: boolean;
  }

  class CustomDatePicker extends React.Component<IProps, IState> {

    state: IState = {
      date: this.props.date ?? new Date(),
      show: false
    };

    componentDidUpdate(prevProps: IProps) {
      if (prevProps.date !== this.props.date && this.props.date) {
        this.setState({ date: this.props.date });
      }
    }

    onChange = (_event: any, selectedDate?: Date) => {
      if (selectedDate) {
        this.setState({ date: selectedDate });
        this.props.onDateChange?.(selectedDate);
      }
    };

    render() {
      const { date, show } = this.state;

      return (
        <View style={{ flex: 1, width: '100%' }}>

          <TouchableOpacity
            style={styles.inputContainerStyle}
            onPress={() => this.setState({ show: !show })}
          >
            <Text style={styles.textStyle}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>

        {show && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={this.onChange}
            />
          </View>
        )}

        {!show && <Button title="Select Date of Birth" onPress={() => this.setState({ show: !show })} />}

        </View>
      );
    }
  }

  export default CustomDatePicker;

  const styles = StyleSheet.create({
    overlayStyle: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      backgroundColor: '#00000066',
    },
    pickerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
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
      backgroundColor: '#3a3f45',
    },

    textStyle: {
      fontFamily: 'Poppins',
      color: '#fff',
      fontSize: 16,
      marginHorizontal: 10,
    }
  });
