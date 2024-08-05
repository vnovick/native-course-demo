import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {
  callVoidMethod,
  callMethodWithArgs,
  callMethodReturningPromise,
} from '../nativeModules/SimpleModule';
import {commonStyles} from '../styles';
import LogComponent from '../components/LogComponent';

const SimpleDemoScreen: React.FC = () => {
  const [promiseResult, setPromiseResult] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const handleVoidMethod = () => {
    callVoidMethod();
  };

  const handleMethodWithArgs = () => {
    callMethodWithArgs(inputValue);
  };

  const handleMethodReturningPromise = () => {
    callMethodReturningPromise(inputValue)
      .then((result: React.SetStateAction<string>) => {
        setPromiseResult(result);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <View style={commonStyles.container}>
      <TextInput
        label="Input Message"
        value={inputValue}
        onChangeText={text => setInputValue(text)}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleVoidMethod} style={styles.button}>
        Call Void Method
      </Button>
      <Button
        mode="contained"
        onPress={handleMethodWithArgs}
        style={styles.button}>
        Call Method With Args
      </Button>
      <Button
        mode="contained"
        onPress={handleMethodReturningPromise}
        style={styles.button}>
        Call Method Returning Promise
      </Button>
      {promiseResult ? (
        <Text style={styles.result}>{promiseResult}</Text>
      ) : null}
      <LogComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    marginTop: 20,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default SimpleDemoScreen;
