import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Animated, Easing} from 'react-native';
import {Button} from 'react-native-paper';
import LogComponent from '../components/LogComponent';
import {commonStyles} from '../styles';
import {performIntensiveCalculations} from '../nativeModules/CalculationsModule';

//TODO: STEP 4: Offload calculations to native module

const CalculationsDemoScreen = () => {
  const [results, setResults] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const startCalculations = () => {
    setIsCalculating(true);
    setTimeout(() => {
      performIntensiveCalculations(10)
        .then((calculationResults: React.SetStateAction<number[]>) => {
          setResults(calculationResults);
        })
        .finally(() => setIsCalculating(false));
    }, 1000);
  };

  const startSpin = useCallback(() => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startSpin());
  }, [spinValue]);

  useEffect(() => {
    startSpin();
  }, [startSpin]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Memory Intensive Calculations</Text>
      <Button
        mode="contained"
        onPress={startCalculations}
        disabled={isCalculating}>
        {isCalculating ? 'Calculating...' : 'Start Calculations'}
      </Button>
      <Animated.View style={[styles.spinner, {transform: [{rotate: spin}]}]}>
        <Text style={styles.spinnerText}>🔄</Text>
      </Animated.View>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>{item}</Text>
          </View>
        )}
      />
      <LogComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultText: {
    color: '#ffffff',
  },
  spinner: {
    marginTop: 20,
    alignSelf: 'center',
  },
  spinnerText: {
    fontSize: 30,
  },
});

export default CalculationsDemoScreen;
