import React from 'react';
import {Box, Center, Text} from '@gluestack-ui/themed';
import {uri} from '../utils/Host';
import UseDataFetching from '../hooks/UseFetchStory';

const StoryDetailScreen = item => {
  const [state, refreshState] = UseDataFetching(
    `${uri}/api/stories/${item.id}`,
  );
  console.log(state.data);
  return (
    <Box bg="$white" p="$5">
      <Center>
        <Text color="$black">Loading...</Text>
      </Center>
    </Box>
  );
};
export default StoryDetailScreen;
