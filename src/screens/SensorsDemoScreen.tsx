import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Animated, ScrollView} from 'react-native';
import {Button, Text, Card, Paragraph, List} from 'react-native-paper';
import {commonStyles} from '../styles';

import {
  SensorsModule,
  SensorsEventEmitter,
} from '../nativeModules/SensorsModule';

const DEAD_SEA_FEET = -1411;
const MAX_ALTITUDE_FEET = 3280.84;

const CompassDemoScreen = () => {
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
    speed: 0,
  });
  const [magnetometerData, setMagnetometerData] = useState({x: 0, y: 0, z: 0});
  const [isTracking, setIsTracking] = useState(false);
  const [altitudeValue, setAltitudeValue] = useState(0);
  const [speedValue, setSpeedValue] = useState(0);
  const rotation = useState(new Animated.Value(0))[0];
  const altitude = useState(new Animated.Value(1))[0];
  const speed = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const magnetometerSubscription = SensorsEventEmitter.addListener(
      'magnetometerData',
      data => {
        setMagnetometerData(data);
        const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        Animated.timing(rotation, {
          toValue: angle,
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    );

    const altitudeSubscription = SensorsEventEmitter.addListener(
      'altitudeData',
      data => {
        setAltitudeValue(data.altitude);
        Animated.timing(altitude, {
          toValue:
            (altitudeValue - DEAD_SEA_FEET) /
            (MAX_ALTITUDE_FEET - DEAD_SEA_FEET),
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    );

    const accelerometerSubscription = SensorsEventEmitter.addListener(
      'accelerometerData',
      data => {
        setAccelerometerData(data);
        const speedValue = data.speed;
        setSpeedValue(speedValue);
        Animated.timing(speed, {
          toValue: speedValue / 100,
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      magnetometerSubscription.remove();
      altitudeSubscription.remove();
      accelerometerSubscription.remove();
    };
  }, [rotation, altitude, speed, altitudeValue]);

  const startTracking = () => {
    setIsTracking(true);
    SensorsModule.startTracking();
  };

  const stopTracking = () => {
    setIsTracking(false);
    SensorsModule.stopTracking();
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [-180, 180],
    outputRange: ['-180deg', '180deg'],
  });

  const compassStyle = {
    transform: [{rotate: rotationInterpolate}],
  };

  const altitudeStyle = {
    transform: [{scaleY: altitude}],
  };

  const speedStyle = {
    transform: [{scaleX: speed}],
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.title}>Mocked Sensor Data</Text>
      <List.AccordionGroup>
        <List.Accordion title="Accelerometer Data" id="1">
          <Card>
            <Card.Content>
              <Paragraph>X: {accelerometerData.x.toFixed(2)}</Paragraph>
              <Paragraph>Y: {accelerometerData.y.toFixed(2)}</Paragraph>
              <Paragraph>Z: {accelerometerData.z.toFixed(2)}</Paragraph>
              <Paragraph>speed: {accelerometerData.speed.toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.visualizationContainer}>
            <Card.Content style={styles.speedContainer}>
              <Text>Speed</Text>
              <Animated.View style={[styles.speedBar, speedStyle]} />
              <Text>{speedValue.toFixed(2)} mph</Text>
            </Card.Content>
          </Card>
        </List.Accordion>
        <List.Accordion title="Altitude Data" id="2">
          <Card style={styles.visualizationContainer}>
            <Card.Content style={styles.altitudeContainer}>
              <Text>Altitude</Text>
              <Text>{altitudeValue.toFixed(2)} ft</Text>
              <View style={styles.altitudeBarContainer}>
                <Animated.View style={[styles.altitudeBar, altitudeStyle]} />
              </View>
            </Card.Content>
          </Card>
        </List.Accordion>
        <List.Accordion title="Magnetometer Data" id="3">
          <Card>
            <Card.Content>
              <Paragraph>X: {magnetometerData.x.toFixed(2)}</Paragraph>
              <Paragraph>Y: {magnetometerData.y.toFixed(2)}</Paragraph>
              <Paragraph>Z: {magnetometerData.z.toFixed(2)}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={styles.visualizationContainer}>
            <Card.Content style={styles.compassContainer}>
              <Animated.View style={[styles.compass, compassStyle]}>
                <View style={styles.compassNeedle} />
              </Animated.View>
            </Card.Content>
          </Card>
        </List.Accordion>
      </List.AccordionGroup>
      <Button
        mode="contained"
        onPress={startTracking}
        disabled={isTracking}
        style={styles.button}>
        {isTracking ? 'Tracking...' : 'Start Tracking'}
      </Button>
      <Button
        mode="contained"
        onPress={stopTracking}
        disabled={!isTracking}
        style={styles.button}>
        Stop Tracking
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    marginVertical: 10,
  },
  visualizationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compass: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassNeedle: {
    width: 2,
    height: 50,
    backgroundColor: 'red',
  },
  altitudeContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 150, // Fixed height for container
  },
  altitudeBarContainer: {
    height: 150, // Same height as container for proper scaling
    justifyContent: 'flex-end',
  },
  altitudeBar: {
    width: 20,
    backgroundColor: 'blue',
    height: 150, // Base height for scaling
  },
  speedContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    width: 100, // Fixed width for container
  },
  speedBar: {
    height: 20,
    backgroundColor: 'green',
    width: 100, // Base width for scaling
  },
});

export default CompassDemoScreen;
