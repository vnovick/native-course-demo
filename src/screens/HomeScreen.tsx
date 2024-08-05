import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import LogComponent from '../components/LogComponent';
import {commonStyles} from '../styles';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Native Module Demos</Text>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('SimpleModuleDemo')}
        style={styles.button}>
        Simple Native Module Demo
      </Button>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('AmbientLightSensorDemo')}
        style={styles.button}>
        Ambient Light Sensor
      </Button>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('CalculationsDemo')}
        style={styles.button}>
        Offset Calculations to Native
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        //@ts-ignore
        onPress={() => navigation.navigate('BluetoothDemo')}>
        Custom Module using Bluetooth API
      </Button>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('SensorsDemo')}
        style={styles.button}>
        Device sensors API
      </Button>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('SensorsUIDemo')}
        style={styles.button}>
        Device sensors API with Custom Native UI
      </Button>
      <Button
        mode="contained"
        //@ts-ignore
        onPress={() => navigation.navigate('ImagePickerDemo')}
        style={styles.button}>
        Image Picker - Activities & Delegates
      </Button>
      <LogComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
});

export default HomeScreen;
