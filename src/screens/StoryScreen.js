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
        onPress={() => callback({id, title, thumbnail, language, type})}>
        <VStack space="4xl">
          <Center>
            <Image
              size="2xl"
              borderRadius="$md"
              source={{
                uri: thumbnail,
              }}
            />
          </Center>
          <Box space="md">
            <Heading size="md" isTruncated={true}>
              {title}
            </Heading>
            <Text size="sm">
              {language} - {type}
            </Text>
          </Box>
          <Divider my="$0.5" />
        </VStack>
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
