import {NativeEventEmitter} from 'react-native';

// Mock Interfaces
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

// Mock Data
const mockDevices: Device[] = [
  {id: '1', name: 'Device 1'},
  {id: '2', name: 'Device 2'},
  {id: '3', name: 'Device 3'},
];

const mockServicesAndCharacteristics: Record<string, Service[]> = {
  '1': [
    {
      id: '1',
      uuid: '0000180d-0000-1000-8000-00805f9b34fb',
      characteristics: [
        {
          id: '1',
          uuid: '00002a37-0000-1000-8000-00805f9b34fb',
          value: 'Characteristic 1 Value',
        },
        {
          id: '2',
          uuid: '00002a38-0000-1000-8000-00805f9b34fb',
          value: 'Characteristic 2 Value',
        },
      ],
    },
  ],
  '2': [
    {
      id: '2',
      uuid: '0000180f-0000-1000-8000-00805f9b34fb',
      characteristics: [
        {
          id: '3',
          uuid: '00002a19-0000-1000-8000-00805f9b34fb',
          value: 'Characteristic 3 Value',
        },
      ],
    },
  ],
  '3': [
    {
      id: '3',
      uuid: '0000180a-0000-1000-8000-00805f9b34fb',
      characteristics: [
        {
          id: '4',
          uuid: '00002a29-0000-1000-8000-00805f9b34fb',
          value: 'Characteristic 4 Value',
        },
        {
          id: '5',
          uuid: '00002a24-0000-1000-8000-00805f9b34fb',
          value: 'Characteristic 5 Value',
        },
      ],
    },
  ],
};

// Mock Event Emitter
const BluetoothEventEmitter = new NativeEventEmitter({
  addListener: () => {},
  removeListeners: () => {},
});

// Mock Functions
const startScan = (): void => {
  console.log('Starting scan...');
  setTimeout(() => {
    mockDevices.map(device =>
      BluetoothEventEmitter.emit('deviceFound', device),
    );
  }, 2000);
};

const stopScan = (): void => {
  console.log('Stopping scan...');
  // Mock: No action needed for stopping scan
};

const connectToDevice = (deviceId: string): Promise<Service[]> => {
  console.log(`Connecting to device ${deviceId}...`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockServicesAndCharacteristics[deviceId]);
    }, 2000);
  });
};

export {startScan, stopScan, connectToDevice, BluetoothEventEmitter};
export type {Device, Service, Characteristic};
