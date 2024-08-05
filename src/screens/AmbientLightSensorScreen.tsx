// import React, {useState, useEffect} from 'react';
// import {Text, StyleSheet, Animated} from 'react-native';
// import {Button} from 'react-native-paper';
// import {
//   SensorsModule,
//   SensorsEventEmitter,
// } from '../nativeModules/mocks/SensorsMockModule';

// const AmbientLightTintScreen: React.FC = () => {
//   const [lightValue, setLightValue] = useState<number>(0);
//   const bgColor = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     SensorsModule.startTracking();
//     const subscription = SensorsEventEmitter.addListener(
//       'ambientLightData',
//       (value: number) => {
//         setLightValue(value);
//         Animated.timing(bgColor, {
//           toValue: value,
//           duration: 300,
//           useNativeDriver: false,
//         }).start();
//       },
//     );

//     return () => {
//       SensorsModule.stopTracking();
//       subscription.remove();
//     };
//   }, [bgColor]);

//   const handleStart = () => {
//     SensorsModule.startTracking();
//   };

//   const handleStop = () => {
//     SensorsModule.stopTracking();
//   };

//   const interpolateColor = bgColor.interpolate({
//     inputRange: [0, 10000], // Assuming 10000 is the max lux value
//     outputRange: ['rgb(255, 255, 255)', 'rgb(0, 0, 0)'], // Change from white to black
//   });

//   const animatedStyle = {
//     backgroundColor: interpolateColor,
//   };

//   return (
//     <Animated.View style={[styles.container, animatedStyle]}>
//       <Text style={styles.text}>Ambient Light Value: {lightValue}</Text>
//       <Button mode="contained" onPress={handleStart} style={styles.button}>
//         Start Sensor
//       </Button>
//       <Button mode="contained" onPress={handleStop} style={styles.button}>
//         Stop Sensor
//       </Button>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     margin: 10,
//   },
//   text: {
//     fontSize: 20,
//     margin: 20,
//   },
// });

// export default AmbientLightTintScreen;

//TODO: STEP 3: Add ambient light sensor

import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Animated} from 'react-native';
import {Button} from 'react-native-paper';
import {
  startSensor,
  stopSensor,
  subscribeToSensor,
} from '../nativeModules/AmbientLightSensorModule';

const AmbientLightTintScreen: React.FC = () => {
  const [lightLevel, setLightLevel] = useState<number>(0);
  const bgColor = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const unsubscribe = subscribeToSensor(value => {
      setLightLevel(value);
      Animated.timing(bgColor, {
        toValue: value,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });

    // startSensor();

    return () => {
      // stopSensor();
      unsubscribe();
    };
  }, [bgColor]);

  const interpolateColor = bgColor.interpolate({
    inputRange: [0, 40000], // Assuming 40000 is the max lux value
    outputRange: ['rgb(255, 255, 255)', 'rgb(0, 0, 0)'], // Change from white to black
  });

  const animatedStyle = {
    backgroundColor: interpolateColor,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>Ambient Light Value: {lightLevel}</Text>
      <Button mode="contained" onPress={startSensor} style={styles.button}>
        Start Sensor
      </Button>
      <Button mode="contained" onPress={stopSensor} style={styles.button}>
        Stop Sensor
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
});

export default AmbientLightTintScreen;
