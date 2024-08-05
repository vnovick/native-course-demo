import {
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';

const {BluetoothModule} = NativeModules;
const BluetoothEventEmitter = new NativeEventEmitter(BluetoothModule);

const requestBluetoothPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    const scanGranted =
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const connectGranted =
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const locationGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    return scanGranted && connectGranted && locationGranted;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const requestBluetoothPermission = async () => {
  if (Platform.OS === 'android') {
    return await requestBluetoothPermissionAndroid();
  }
  // iOS does not require explicit permission handling here
  return true;
};

const startScan = async () => {
  const hasPermission = await requestBluetoothPermission();
  if (hasPermission) {
    BluetoothModule.startScan().catch((error: Error) => {
      console.error(error);
    });
  } else {
    console.log('Bluetooth or location permission denied');
  }
};

const stopScan = async () => {
  const hasPermission = await requestBluetoothPermission();
  if (hasPermission) {
    BluetoothModule.stopScan().catch((error: Error) => {
      console.error(error);
    });
  } else {
    console.log('Bluetooth or location permission denied');
  }
};

const connectToDevice = async (deviceId: string) => {
  const hasPermission = await requestBluetoothPermission();
  if (hasPermission) {
    try {
      const services = await BluetoothModule.connectToDevice(deviceId);
      return services;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    console.log('Bluetooth or location permission denied');
    throw new Error('Bluetooth or location permission denied');
  }
};

export {startScan, stopScan, connectToDevice, BluetoothEventEmitter};

interface Device {
  id: string;
  name: string;
}

interface Characteristic {
  id: string;
  uuid: string;
  value: string;
}

interface Service {
  id: string;
  uuid: string;
  characteristics: Characteristic[];
}

export type {Device, Service, Characteristic};
