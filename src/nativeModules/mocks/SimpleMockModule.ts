import {Alert} from 'react-native';

export const callVoidMethod = () => {
  Alert.alert('Void Method Called');
};

export const callMethodWithArgs = (message: string) => {
  Alert.alert('Method called with args: ' + message);
};

export const callMethodReturningPromise = (message: string) => {
  return Promise.resolve(message);
};
