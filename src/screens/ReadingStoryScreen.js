import React, {useState} from 'react';
import {Box, Text} from '@gluestack-ui/themed';
import useFetchStory from '../hooks/UseFetch';
import {uri} from '../utils/Host';
const responsePayload = {
  id: 0,
  page_number: 0,
  background: '',
  text_configs: [
    {
      position: {
        x: 0,
        y: 0,
      },
      order: 0,
      text: {
        id: 0,
        text: '',
      },
    },
  ],
};
const ReadingStoryScreen = props => {
  const pages = props.route.params.pages;
  const [pageId, setPageId] = useState(pages[0]);
  const [{data, isLoading, error}] = useFetchStory(
    `${uri}/api/pages/${pageId}?embed=texts`,
    responsePayload,
  );
  if (data.text_configs.length === 0) {
    //TODO: handle this case, use canvas to draw the story's page (background,...)
    return (
      <Box bg="$white" p="$5">
        <Text>this story no content...</Text>
      </Box>
    );
  }
  if (isLoading) {
    return (
      <Box bg="$white" p="$5">
        <Text>loading...</Text>
      </Box>
    );
  }
  return (
    <Box bg="$white" p="$5">
      <Text>{data.text_configs[0].text.text}</Text>
    </Box>
  );
};
export default ReadingStoryScreen;
