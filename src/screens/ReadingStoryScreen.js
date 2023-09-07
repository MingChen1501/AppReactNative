import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Fab,
  FabLabel,
  HStack,
  Pressable,
  Text,
} from '@gluestack-ui/themed';
import Sound from 'react-native-sound';
import useFetchStory from '../hooks/UseFetch';
import {uri} from '../utils/Host';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import {Alert, Dimensions, PanResponder} from 'react-native';

const sound = new Sound(require('../assests/apple.mp3'), error => {
  if (error) {
    Alert('sound error');
  }
});
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
  let timeoutId;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gestureState) => {
      console.log('Touch started at:', gestureState.x0, gestureState.y0);
      const drawText = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
          //TODO: should be check gestureState position in touchable object position
          if (true) {
            const ctx = canvas.getContext('2d');
            ctx.font = '16px serif';
            clearTimeout(timeoutId);
            ctx.clearRect(0, 0, width, height);
            sound.stop();
            const textMetrics = await ctx.measureText(
              data.text_configs[1].text.text,
            );
            ctx.fillText(
              data.text_configs[1].text.text,
              gestureState.x0,
              gestureState.y0,
            );
            const x = gestureState.x0;
            const y = gestureState.y0;
            strokeRoundRect(x - 5, y - 24, textMetrics.width + 10, 32, 10);
            sound.play();
            timeoutId = setTimeout(() => {
              ctx.clearRect(0, 0, width, height);
            }, 3000);
            function strokeRoundRect(x, y, width, height, radius) {
              ctx.beginPath();
              ctx.moveTo(x + radius, y);
              ctx.lineTo(x + width - radius, y);
              ctx.arcTo(x + width, y, x + width, y + radius, radius);
              ctx.lineTo(x + width, y + height - radius);
              ctx.arcTo(
                x + width,
                y + height,
                x + width - radius,
                y + height,
                radius,
              );
              ctx.lineTo(x + radius, y + height);
              ctx.arcTo(x, y + height, x, y + height - radius, radius);
              ctx.lineTo(x, y + radius);
              ctx.arcTo(x, y, x + radius, y, radius);
              ctx.closePath();
              ctx.stroke();
            }
          }
          // Example usage
        }
      };
      // Handle touch start event
      // data.text_configs.map((text, index) => {
      //   console.log(text);
      // });
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
    //TODO:impl swipe to forward or back page
  });
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const drawBackground = async background => {
      const ctx = background.getContext('2d');
      const image = new CanvasImage(background);
      const textData = data.text_configs[0];
      image.src = data.background;
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, background.width, background.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(textData.text.text, 50, 50);
        sound.play();
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
    <Box width="100%" height="100%" {...panResponder.panHandlers}>
      <Canvas
        ref={backgroundRef}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
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
