import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, List, Card} from 'react-native-paper';
import {commonStyles} from '../styles';
import LogComponent from '../components/LogComponent';
import {
  BluetoothEventEmitter,
  connectToDevice,
  Device,
  Service,
  startScan,
  stopScan,
} from '../nativeModules/BluetoothModule';

const BluetoothDemoScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  useEffect(() => {
    const subscription = BluetoothEventEmitter.addListener(
      'deviceFound',
      (device: Device) => {
        setDevices(prevDevices => [...prevDevices, device]);
      },
    );

    const scanSubscription = BluetoothEventEmitter.addListener(
      'scanStarted',
      () => {
        setIsScanning(true);
      },
    );

    const scanStopSubscription = BluetoothEventEmitter.addListener(
      'scanStopped',
      () => {
        setIsScanning(false);
        setServices([]);
        setConnectedDevice(null);
      },
    );

    return () => {
      stopScan();
      scanSubscription.remove();
      scanStopSubscription.remove();
      subscription.remove();
    };
  }, []);

  const startScanDevices = () => {
    startScan();
  };

  const stopScanDevices = () => {
    stopScan();
    setDevices([]);
  };

  const connectToBluetoothDevice = (device: Device) => {
    connectToDevice(device.id).then(
      (foundServices: React.SetStateAction<Service[]>) => {
        setConnectedDevice(device);
        setServices(foundServices);
      },
    );
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Bluetooth API Demo</Text>
      <Button mode="contained" onPress={startScanDevices} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Start Scan'}
      </Button>
      <Button
        mode="contained"
        onPress={stopScanDevices}
        style={styles.button}
        disabled={!isScanning}>
        Stop Scan
      </Button>
      {connectedDevice && (
        <List.Section>
          <List.Accordion
            title={`Connected to: ${
              connectedDevice.name == 'Unknown'
                ? connectedDevice.id
                : connectedDevice.name
            }`}
            expanded={expanded}
            onPress={handlePress}>
            {services.map(service => (
              <List.Item
                key={service.id}
                title={`Service: ${service.uuid}`}
                descriptionNumberOfLines={5}
                description={service.characteristics
                  .map(
                    char =>
                      `Characteristic: ${char.uuid} - Value: ${char.value}`,
                  )
                  .join('\n')}
              />
            ))}
          </List.Accordion>
        </List.Section>
      )}
      <List.Section>
        {devices.map(device => (
          <Card
            key={`${device.id}-${device.name}`}
            style={styles.deviceCard}
            onPress={() => connectToBluetoothDevice(device)}>
            <Card.Title
              title={device.name == 'Unknown' ? device.id : device.name}
            />
          </Card>
        ))}
      </List.Section>
      <LogComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  deviceCard: {
    marginVertical: 8,
  },
  deviceText: {
    color: '#ffffff',
  },
  deviceInfo: {
    marginVertical: 20,
  },
  service: {
    marginTop: 10,
  },
  serviceText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  characteristicText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  descriptionStyle: {
    color: '#ffffff', // Adjust the color if needed
    flex: 1, // Ensure it takes the available space
    flexWrap: 'wrap', // Wrap text within the container
  },
});

export default BluetoothDemoScreen;
