import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Fab,
  FabLabel,
  HStack,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import useFetchStory from '../hooks/UseFetch';
import {uri} from '../utils/Host';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import {Dimensions, PanResponder} from 'react-native';

const {width, height} = Dimensions.get('window');
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
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gestureState) => {
      const drawText = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.font = '16px serif';
          ctx.clearRect(0, 0, width, height);
          ctx.fillText(
            data.text_configs[1].text.text,
            gestureState.x0,
            gestureState.y0,
          );
          const x = gestureState.x0;
          const y = gestureState.y0;
          const textMetrics = await ctx.measureText(
            data.text_configs[1].text.text,
          );
          console.log(textMetrics);
          setTimeout(() => {
            const textX = x;
            const textY = y;
            const textWidth = textMetrics.width;
            const textHeight = 30;
            ctx.clearRect(textX, textY - 20, textWidth, textHeight);
          }, 3000);
        }
      };
      // Handle touch start event
      drawText();
    },
    onPanResponderMove: (event, gestureState) => {
      // Handle touch move event
      console.log('Touch moved to:', gestureState.moveX, gestureState.moveY);
    },
    onPanResponderRelease: (event, gestureState) => {
      // Handle touch end event
      console.log('Touch released at:', gestureState.moveX, gestureState.moveY);
    },
  });
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const drawPage = async canvas => {
      const ctx = canvas.getContext('2d');
      const textData = data.text_configs[contentIndex];
      console.log(canvas.width, canvas.height);
      const image = new CanvasImage(canvas);
      image.src = data.background;
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(textData.text.text, 50, 50);
        // Draw touchable objects
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(50, 50, 50, 50);
      });
    };
    const drawBackground = async background => {
      const ctx = background.getContext('2d');
      const image = new CanvasImage(background);
      image.src = data.background;
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, background.width, background.height);
      });
    };
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (backgroundCanvas && canvas) {
      backgroundCanvas.width = width;
      backgroundCanvas.height = height;
      canvas.width = width;
      canvas.height = height;
      drawBackground(backgroundCanvas);
    }
    // if (canvas) {
    //   canvas.width = width;
    //   canvas.height = height;
    //   drawPage(canvas);
    // }
  }, [isLoading, data, contentIndex]);
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
    <Box width="100%" height="100%" {...panResponder.panHandlers}>
      <Canvas
        ref={backgroundRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Canvas ref={canvasRef} style={{width: '100%', height: '100%'}} />
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
