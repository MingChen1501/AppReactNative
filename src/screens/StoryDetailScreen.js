import React, { useRef } from 'react';
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
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import {fromByteArray} from 'base64-js';

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
  const jwt = useSelector(state => state.jwt);
  const [{data, isLoading, error}] = UseDataFetching(
    `${uri}/api/stories/${dataProps.id}?embed=pages`,
    responsePayload,
  );
  const storyDownloadedData = useRef([]);

  const mapPagesToIds = pages => {
    return pages
      .sort((p1, p2) => {
        return p1.page_number - p2.page_number;
      })
      .map(page => {
        let id, page_number;
        id = page.id;
        page_number = page.page_number;
        return {id, page_number};
      });
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
  const option = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
  };
  const downloadAndReadingStory = async () => {
    const downloadResource = async (url, savePath, page) => {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = response.data;
        const base64Image = fromByteArray(new Uint8Array(imageBuffer));
        storyDownloadedData.current.push({
          pageNumber: page.page_number,
          base64Image: base64Image,
        });
        await RNFS.writeFile(savePath, base64Image, 'base64');
      } catch (e) {
        console.error('Error downloading resource:', e);
      }
    };
    const downloadStoryResources = async () => {
      try {
        for (const page of mapPagesToIds(data.pages)) {
          console.log(page);
          const pageResponse = await axios.get(
            `${uri}/api/pages/${page.id}?embed=texts`,
            option,
          );
          const {background, audioUrl, textUrl, syncTextSoundUrl} =
            pageResponse.data;
          console.log(background);
          await downloadResource(
            background,
            `${RNFS.PicturesDirectoryPath}/image${page}.png`,
            page,
          );
          // await downloadResource(audioUrl, '/path/to/save/audio.mp3');
          // await downloadResource(textUrl, '/path/to/save/text.txt');
          // await downloadResource(
          //   syncTextSoundUrl,
          //   '/path/to/save/sync_text_sound.json',
          // );
          // console.log('downloaded', storyDownloadedData.current);
        }
      } catch (e) {
        console.error('Error downloading story resources:', e);
      }
    };
    storyDownloadedData.current = [];
    await downloadStoryResources();
    navigator.navigate('DownloadAndReadingStory', {
      storyDownloadedData: storyDownloadedData.current,
    });
    console.log('downloadAndReadingStory');
  };

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
