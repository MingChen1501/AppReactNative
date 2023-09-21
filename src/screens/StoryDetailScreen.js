import React from 'react';
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
import UseDataFetching from '../hooks/UseFetch';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const responsePayload = {
  id: '',
  title: '',
  thumbnail: '',
  pages: [
    {
      id: '',
      page_numbers: '',
      texts: [
        {
          id: '',
          text: '',
        },
      ],
    },
  ],
};
const StoryDetailScreen = item => {
  const navigator = useNavigation();
  const dataProps = item.route.params;
  const [{data, isLoading, error}] = UseDataFetching(
    `${uri}/api/stories/${dataProps.id}?embed=pages`,
    responsePayload,
  );
  const mapPagesToIds = pages => {
    return pages
      .sort((p1, p2) => {
        return p1.page_number - p2.page_number;
      })
      .map(page => page.id);
  };
  if (error !== null) {
    return (
      <Center>
        <Text>Error</Text>
      </Center>
    );
  }
  function readingStory() {
    navigator.navigate('ReadingStory', {pages: mapPagesToIds(data.pages)});
  }
  function downloadAndReadingStory() {
    const downloadResource = async (url, savePath) => {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });
        const resourceData = response.data;
        console.log(resourceData);
      } catch (error) {
        console.log('Error downloading resource:', error);
      }
    };
    const downloadStoryResources = async () => {
      try {
        for (const page of mapPagesToIds(data.pages)) {
          // Step 3: Retrieve page details
          const pageResponse = await axios.get(
            `${uri}/api/pages/${page.id}?embed=text`,
          );
          const {imageUrl, audioUrl, textUrl, syncTextSoundUrl} =
            pageResponse.data;

          // Step 5-6: Download and save resources
          await downloadResource(imageUrl, '/path/to/save/image.jpg');
          await downloadResource(audioUrl, '/path/to/save/audio.mp3');
          await downloadResource(textUrl, '/path/to/save/text.txt');
          await downloadResource(
            syncTextSoundUrl,
            '/path/to/save/sync_text_sound.json',
          );
        }
      } catch (error) {
        console.error('Error downloading story resources:', error);
      }
      // navigator.navigate('DownloadAndReadingStory', {
      //   pages: mapPagesToIds(data.pages),
      // });
      console.log('downloadAndReadingStory');
    };
  }

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
              isFocusVisible={false}
              onPress={() => readingStory()}>
              <ButtonText>Study </ButtonText>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              onPress={() => downloadAndReadingStory()}>
              <ButtonText>Download and reading </ButtonText>
            </Button>
          </VStack>
        </HStack>
      </Box>
    );
  }
};
export default StoryDetailScreen;
