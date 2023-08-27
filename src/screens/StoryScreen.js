import React, {useState} from 'react';
import {
  Box,
  Center,
  Divider,
  Fab,
  FabLabel,
  Heading,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import UseDataFetching from '../hooks/UseFetchStory';
import {uri} from '../utils/Host';
import {useNavigation} from '@react-navigation/native';

const StoryScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [state, refreshState] = UseDataFetching(`${uri}/api/stories`);
  // chưa nghĩ ra tên nào OK hơn
  const handleRefresh = async () => {
    setRefreshing(true);
    refreshState();
    setRefreshing(false);
  };
  const navigateToDetail = item => {
    navigation.navigate('StoryDetail', item);
  };
  const renderItem = (
    {item: {id, title, thumbnail, language, type}},
    callback,
  ) => {
    return (
      <TouchableOpacity
        style={{margin: 7}}
        onPress={() => callback({id, title, thumbnail, language, type})}>
        <VStack space="2xl">
          <Center>
            <Image
              size="xl"
              borderRadius="$md"
              source={{
                uri: thumbnail,
              }}
            />
            <Text size="sm">
              {language} - {type}
            </Text>
          </Center>
        </VStack>
        <Divider my="$0.5" />
      </TouchableOpacity>
    );
  };
  if (state.isLoading) {
    return (
      <Box bg="$white" p="$5">
        <Center>
          <Text color="$black">Loading...</Text>
        </Center>
      </Box>
    );
  }
  return (
    <Box bg="$white" p="$5">
      <FlatList
        data={state.data}
        renderItem={({item}) => renderItem({item}, navigateToDetail)}
        keyExtractor={item => item.id}
        numColumns={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <Fab
        marginBottom={32}
        size="lg"
        placement="top right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => console.log('create')}>
        <FabLabel>Create</FabLabel>
      </Fab>
    </Box>
  );
};
export default StoryScreen;
