import React from 'react';
import {config, GluestackUIProvider} from '@gluestack-ui/themed';
import StoryScreen from './screens/StoryScreen';

const App = () => {
  return (
    <GluestackUIProvider config={config.theme}>
      <StoryScreen />
    </GluestackUIProvider>
  );
};
export default App;
