// import React, { useEffect } from 'react';
// import { StatusBar } from 'react-native';
// import RootNavigator from './src/navigation/RootNavigator';
//
// const App = () => {
//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="#667eea" />
//       <RootNavigator />
//     </>
//   );
// };
//
// export default App;


import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 35;

  return (
    <SafeAreaProvider
      style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;