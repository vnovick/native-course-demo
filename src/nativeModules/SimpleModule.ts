import {NativeModules} from 'react-native';

const {SimpleDemoModule} = NativeModules;

export const callVoidMethod = () => {
  SimpleDemoModule.voidMethod();
};

export const callMethodWithArgs = (message: string) => {
  SimpleDemoModule.methodWithArgs(message);
};

export const callMethodReturningPromise = (message: string) => {
  return SimpleDemoModule.methodReturningPromise(message);
};
