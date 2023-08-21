/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {config, GluestackUIProvider, Text} from '@gluestack-ui/themed';

function App(): Element {
  return (
    <GluestackUIProvider config={config.theme}>
      <Text>Hello World!</Text>
    </GluestackUIProvider>
  );
}

export default App;
