import React, {useEffect, useRef, useState} from 'react';
import {Box, Fab, FabLabel, HStack, Pressable, Text} from '@gluestack-ui/themed';
import useFetchStory from '../hooks/UseFetch';
import {uri} from '../utils/Host';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
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
  const [contentIndex, setContentIndex] = useState([0]);
  const [pageIndex, setPageindex] = useState(0);
  const [{data, isLoading, error}] = useFetchStory(
    `${uri}/api/pages/${pageId}?embed=texts`,
    responsePayload,
  );
  const canvasRef = useRef(null);
  useEffect(() => {
    const drawPage = async canvas => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(data.text_configs[contentIndex].text.text, 50, 50);
      // Draw touchable objects
      ctx.fillStyle = 'rgba(179,229,252,0.51)';
      ctx.fillRect(100, 100, 50, 50);
      ctx.fillStyle = 'rgba(0,0,0,0.83)';
      ctx.fillRect(200, 100, 50, 50);
    };
    const canvas = canvasRef.current;
    if (canvas) {
      drawPage(canvas);
    }
  }, [isLoading, data]);
  if (data.text_configs.length === 0) {
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
    <Box width="100%" height="100%">
      <Canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
        }}
      />
      <Fab
        size="sm"
        placement="top right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => console.log('menu')}>
        <FabLabel>Menu</FabLabel>
      </Fab>
    </Box>
  );
};
export default ReadingStoryScreen;
