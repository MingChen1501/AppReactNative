import React, {useEffect} from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {uri} from '../utils/Host';
import UseDataFetching from '../hooks/UseFetchStory';

const StoryDetailScreen = item => {
  const dataProps = item.route.params;
  const [{data, isLoading, error}, fetchData] = UseDataFetching(
    `${uri}/api/stories/${dataProps.id}?embed=pages`,
  );
  useEffect(() => {
    fetchData();
    console.log('StoryDetailScreen', error);
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
        <HStack space="4xl">
          <Image
            size="2xl"
            borderRadius="$md"
            source={{
              uri: dataProps.thumbnail,
            }}
          />
          <VStack space="md">
            <Heading size="md" width={300}>
              {dataProps.title}
            </Heading>
            <Text size="lg">
              {dataProps.language} - {dataProps.type}
            </Text>
            <Text size="sm">{data.pages.length} pages</Text>
            <Divider my="$0.5" />
            <Button
              size="lg"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}>
              <ButtonText>Study </ButtonText>
            </Button>
          </VStack>
        </HStack>
      </Box>
    );
  }
};
export default StoryDetailScreen;
