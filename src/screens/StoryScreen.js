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
import {FlatList, RefreshControl} from 'react-native';
import UseDataFetching from '../hooks/UseFetchStory';
import {uri} from '../utils/Host';

const renderItem = ({
  item: {language, thumbnail, title, type, pageQuantity},
}) => {
  return (
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
  );
};
const StoryScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [state, refreshState] = UseDataFetching(`${uri}/api/stories`);
  // chưa nghĩ ra tên nào OK hơn
  //
  const handleRefresh = async () => {
    setRefreshing(true);
    refreshState();
    setRefreshing(false);
  };
  if (state.isLoading) {
    return (
      <Box bg="$white" p="$5">
        <Text color="$black">Story Screen</Text>
        <Divider my="$0.5" />
      </Box>
    );
  }
  return (
    <Box bg="$white" p="$5">
      <Text color="$black">Story Screen</Text>
      <Divider my="$0.5" />
      <FlatList
        data={state.data}
        renderItem={renderItem}
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
