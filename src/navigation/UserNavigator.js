import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const UserNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Story">
      <Stack.Screen name="Story" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
