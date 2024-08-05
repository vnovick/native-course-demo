import {NativeEventEmitter, NativeModules} from 'react-native';

const {AmbientSensorModule} = NativeModules;

const lightSensorEventEmitter = new NativeEventEmitter(AmbientSensorModule);

export const startSensor = () => {
  AmbientSensorModule.start();
};

export const stopSensor = () => {
  AmbientSensorModule.stop();
};

export const subscribeToSensor = (callback: (value: number) => void) => {
  const subscription = lightSensorEventEmitter.addListener(
    'onLightSensorChange',
    callback,
  );
  return () => subscription.remove();
};
