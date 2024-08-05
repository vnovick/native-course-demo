import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {TabView, SceneMap} from 'react-native-tab-view';
import {getJsLogs} from './LogOverride';
// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';

// const spyFunction = (msg: SpyData) => {
//   if (msg.module !== 'WebSocketModule') {
//     const direction =
//       msg.type === 0 ? 'native -> javascript' : 'javascript -> native';
//     console.log(
//       `${msg.module}: ${direction}, method: ${msg.method}, ${JSON.stringify(
//         msg.args,
//       )}`,
//       {
//         ...msg,
//         type: msg.type === 0 ? 'native -> javascript' : 'javascript -> native',
//       },
//     );
//   }
// };

// MessageQueue.spy(spyFunction);

// Native logs mock
const nativeLogs = [
  'Native Log 1',
  'Native Log 2',
  // Add more native logs here
];

const NativeLogs = () => (
  <ScrollView style={styles.logContainer}>
    {nativeLogs.map((log, index) => (
      <Text key={index} style={styles.logText}>
        {log}
      </Text>
    ))}
  </ScrollView>
);

const JSLogs = () => {
  const [logs, setLogs] = useState<string[]>(getJsLogs());

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...getJsLogs()]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.logContainer}>
      {logs.map((log, index) => (
        <Text key={index} style={styles.logText}>
          {log}
        </Text>
      ))}
    </ScrollView>
  );
};

const LogComponent = () => {
  const [index, setIndex] = useState(0);
  const [showLogs, setShowLogs] = useState(false);
  const [routes] = useState([
    {key: 'js', title: 'JS Logs'},
    {key: 'native', title: 'Native Logs'},
  ]);

  const renderScene = SceneMap({
    native: NativeLogs,
    js: JSLogs,
  });

  return (
    <View style={styles.container}>
      <Button
        icon={showLogs ? 'chevron-double-up' : 'chevron-double-down'}
        mode="text"
        onPress={() => setShowLogs(!showLogs)}>
        {showLogs ? 'Hide' : 'Show'} Logs
      </Button>
      {showLogs && (
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 32},
  logContainer: {
    padding: 10,
  },
  logText: {
    color: '#ffffff',
    marginBottom: 10,
  },
});

export default LogComponent;

//TODO: STEP 2: Add native logs

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   NativeEventEmitter,
//   NativeModules,
// } from 'react-native';
// import {Button} from 'react-native-paper';
// import {TabView, SceneMap} from 'react-native-tab-view';
// import {getJsLogs} from './LogOverride';

// const {NativeLogsModule} = NativeModules;
// const nativeEventEmitter = new NativeEventEmitter(NativeLogsModule);

// const NativeLogs = () => {
//   const [nativeLogs, setNativeLogs] = useState([]);

//   useEffect(() => {
//     const subscription = nativeEventEmitter.addListener(
//       'onNativeLog',
//       ({log}) => {
//         setNativeLogs(prevLogs => [...prevLogs, log]);
//       },
//     );
//     NativeLogsModule.startLogging();

//     return () => {
//       NativeLogsModule.stopLogging();
//       subscription.remove();
//     };
//   }, []);

//   return (
//     <ScrollView style={styles.logContainer}>
//       {nativeLogs.map((log, index) => (
//         <Text key={index} style={styles.logText}>
//           {log}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// };

// const JSLogs = () => {
//   const [logs, setLogs] = useState<string[]>(getJsLogs());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLogs([...getJsLogs()]);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <ScrollView style={styles.logContainer}>
//       {logs.map((log, index) => (
//         <Text key={index} style={styles.logText}>
//           {log}
//         </Text>
//       ))}
//     </ScrollView>
//   );
// };

// const LogComponent = () => {
//   const [index, setIndex] = useState(0);
//   const [showLogs, setShowLogs] = useState(false);
//   const [routes] = useState([
//     {key: 'js', title: 'JS Logs'},
//     {key: 'native', title: 'Native Logs'},
//   ]);

//   const renderScene = SceneMap({
//     native: NativeLogs,
//     js: JSLogs,
//   });

//   return (
//     <View style={styles.container}>
//       <Button
//         icon={showLogs ? 'chevron-double-up' : 'chevron-double-down'}
//         mode="text"
//         onPress={() => setShowLogs(!showLogs)}>
//         {showLogs ? 'Hide' : 'Show'} Logs
//       </Button>
//       {showLogs && (
//         <TabView
//           navigationState={{index, routes}}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, marginTop: 32},
//   logContainer: {
//     padding: 10,
//   },
//   logText: {
//     color: '#ffffff',
//     marginBottom: 10,
//   },
// });

// export default LogComponent;
