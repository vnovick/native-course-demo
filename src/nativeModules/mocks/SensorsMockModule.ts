import {NativeEventEmitter} from 'react-native';

const mockNativeEventEmitter = new NativeEventEmitter({
  addListener: () => {},
  removeListeners: () => {},
});

class MockSensorsModule {
  private isTracking = false;
  private eventEmitter = mockNativeEventEmitter;

  startTracking(): void {
    if (this.isTracking) {
      console.log('Tracking already started');
      return;
    }
    this.isTracking = true;
    this.simulateSensorData();
  }

  stopTracking(): void {
    if (!this.isTracking) {
      console.log('Tracking not started');
      return;
    }
    this.isTracking = false;
  }

  private simulateSensorData() {
    const emitSensorData = () => {
      if (!this.isTracking) return;

      const accelerometerData = {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        speed: (Math.random() - 0.5) * 20,
      };
      const altitudeData = {
        altitude: (Math.random() - 0.5) * 20,
      };
      const magnetometerData = {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100,
      };
      const ambientLightData = Math.random() * 10000; // Mock value between 0 and 10000 lux

      this.eventEmitter.emit('accelerometerData', accelerometerData);
      this.eventEmitter.emit('altitudeData', altitudeData);
      this.eventEmitter.emit('magnetometerData', magnetometerData);
      this.eventEmitter.emit('ambientLightData', ambientLightData);

      setTimeout(emitSensorData, 1000);
    };

    emitSensorData();
  }

  addListener(eventType: string, listener: (data: any) => void) {
    return this.eventEmitter.addListener(eventType, listener);
  }

  removeListener(eventType: string, listener: (data: any) => void) {
    this.eventEmitter.removeListener(eventType, listener);
  }
}

const SensorsModule = new MockSensorsModule();
const SensorsEventEmitter = SensorsModule;

export {SensorsModule, SensorsEventEmitter};
