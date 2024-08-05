import {NativeModules} from 'react-native';

const {CalculationsModule} = NativeModules;

const calculateFibonacci = (num: number): Promise<number> => {
  return CalculationsModule.calculateFibonacci(num);
};

const performIntensiveCalculations = (
  iterations: number,
): Promise<number[]> => {
  return CalculationsModule.performIntensiveCalculations(iterations);
};

export {calculateFibonacci, performIntensiveCalculations};
