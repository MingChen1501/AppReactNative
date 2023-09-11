import React from 'react';
import {config, GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import UserNavigator from './navigation/UserNavigator';

const App = () => {
  const isLogged = false;
  const navigator = isLogged ? <AppNavigator /> : <UserNavigator />;
  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer>{navigator}</NavigationContainer>
    </GluestackUIProvider>
  );
};
export default App;
