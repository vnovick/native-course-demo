/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import HomeScreen from './screens/HomeScreen';
import BluetoothDemoScreen from './screens/BluetoothDemoScreen';
import CalculationsDemoScreen from './screens/CalculationsDemoScreen';

import AmbientLightSensorScreen from './screens/AmbientLightSensorScreen';
import SensorsUIDemoScreen from './screens/SensorsUIDemoScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperProvider} from 'react-native-paper';

import {NavBar} from './components/NavBar';

import {theme} from './theme';
import SimpleModuleDemoScreen from './screens/SimpleModuleDemoScreen';
import SensorDemoScreen from './screens/SensorsDemoScreen';
import ImagePickerDemoScreen from './screens/ImagePickerDemoScreen';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as LogOverride from './components/LogOverride';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{header: NavBar}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="SimpleModuleDemo"
            component={SimpleModuleDemoScreen}
          />
          <Stack.Screen
            name="AmbientLightSensorDemo"
            component={AmbientLightSensorScreen}
          />
          <Stack.Screen
            name="CalculationsDemo"
            component={CalculationsDemoScreen}
          />
          <Stack.Screen name="BluetoothDemo" component={BluetoothDemoScreen} />
          <Stack.Screen name="SensorsDemo" component={SensorDemoScreen} />
          <Stack.Screen name="SensorsUIDemo" component={SensorsUIDemoScreen} />
          <Stack.Screen
            name="ImagePickerDemo"
            component={ImagePickerDemoScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
