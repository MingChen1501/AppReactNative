import React from 'react';
import {config, GluestackUIProvider, Text} from '@gluestack-ui/themed';

const App = () => {
  return (
    <GluestackUIProvider config={config.theme}>
      <Text>Hello World!</Text>
    </GluestackUIProvider>
  );
};
export default App;
