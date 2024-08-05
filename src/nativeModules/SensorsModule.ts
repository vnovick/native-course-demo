import {NativeModules, NativeEventEmitter} from 'react-native';

const {SensorsModule} = NativeModules;
const SensorsEventEmitter = new NativeEventEmitter(SensorsModule);

export {SensorsModule, SensorsEventEmitter};
