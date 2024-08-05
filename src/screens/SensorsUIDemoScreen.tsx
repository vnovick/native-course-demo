import React from 'react';
import {requireNativeComponent, View, StyleSheet} from 'react-native';
import {commonStyles} from '../styles';
import {Text} from 'react-native-paper';

const SensorDataView = requireNativeComponent('SensorDataView');

const SensorDemoScreen = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Sensor Native UI Data View</Text>
      <SensorDataView style={styles.sensorDataView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sensorDataView: {
    flex: 1,
  },
});

export default SensorDemoScreen;
