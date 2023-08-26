import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryScreen from '../screens/StoryScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Story">
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
