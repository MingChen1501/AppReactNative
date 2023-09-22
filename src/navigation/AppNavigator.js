import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryScreen from '../screens/StoryScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import ReadingStoryScreen from '../screens/ReadingStoryScreen';
import DownloadAndReadingStoryScreen from '../screens/DownloadAndReadingStory';

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Story">
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
      <Stack.Screen
        name="ReadingStory"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
        component={ReadingStoryScreen}
      />
      <Stack.Screen
        name="DownloadAndReadingStory"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
        component={DownloadAndReadingStoryScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
