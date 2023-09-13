import React, {useEffect} from 'react';
import {config, GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import UserNavigator from './navigation/UserNavigator';
import {useSelector, Provider} from 'react-redux';
import store from './redux/Store';

const App = () => {
  const isLogged = useSelector(state => state.isLogged);
  const navigator = isLogged ? <AppNavigator /> : <UserNavigator />;
  useEffect(() => {
    console.log('isLogged', isLogged);
  }, [isLogged]);
  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer>{navigator}</NavigationContainer>
    </GluestackUIProvider>
  );
};
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
export default Root;
