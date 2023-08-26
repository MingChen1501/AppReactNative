import React, {useEffect} from 'react';
import { Box, Button, Center, Heading, Image, Text } from "@gluestack-ui/themed";
import {uri} from '../utils/Host';
import UseDataFetching from '../hooks/UseFetchStory';
import { Title } from "@gluestack-ui/themed/build/components/core/Toast/styled-components";

const StoryDetailScreen = item => {
  const dataProps = item.route.params;
  const [{data, isLoading, error}, fetchData] = UseDataFetching(
    `${uri}/api/stories/${dataProps.id}?embed=pages.texts`,
  );
  useEffect(() => {
    fetchData();
  }, [error]);
  if (isLoading) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  } else {
    return (
      <Box bg="$white" p="$5">
        <Center>
          <Image
            size="2xl"
            borderRadius="$md"
            source={{
              uri: dataProps.thumbnail,
            }}
          />
          <Heading size="md" isTruncated={true}>
            {dataProps.title}
          </Heading>
          <Text size="lg">
            {dataProps.language} - {dataProps.type}
          </Text>
          <Text size="sm">{data.pages.length} pages</Text>
        </Center>
      </Box>
    );
  }
};
export default StoryDetailScreen;
