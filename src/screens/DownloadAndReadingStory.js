import React, {useEffect, useRef, useState} from 'react';
import {Box} from '@gluestack-ui/themed';
import {Dimensions, PanResponder, Text} from 'react-native';
import Canvas, {
  Image as CanvasImage,
  ImageData,
  Path2D,
} from 'react-native-canvas';

const {width, height} = Dimensions.get('window');

const DownloadAndReadingStoryScreen = props => {
  const [pageIndex, setPageIndex] = useState(0);
  const textRef = useRef(null);
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  console.log(props.route.params.storyDownloadedData.length);
  const background =
    props.route.params.storyDownloadedData[pageIndex].base64Image;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: async (_event, gestureState) => {},
    onPanResponderMove: (event, gestureState) => {},
    onPanResponderRelease: (event, gestureState) => {
      const {dx, dy} = gestureState;
      const horizontalSwipe = Math.abs(dx) > Math.abs(dy);
      if (horizontalSwipe) {
        const tmp = 0.2 * width;
        console.log(dx, tmp);
        if (dx > tmp) {
          if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
          }
        } else if (dx < -tmp) {
          if (pageIndex < props.route.params.storyDownloadedData.length - 1) {
            setPageIndex(pageIndex + 1);
          }
        }
      } else {
        const tmp = 0.4 * height;
        if (dy > tmp) {
        }
      }
    },
  });

  useEffect(() => {
    const drawBackground = async backgroundCanvas => {
      const ctx = backgroundCanvas.getContext('2d');
      const image = new CanvasImage(backgroundCanvas);
      image.src = `data:image/png;base64,${background}`;
      image.addEventListener('load', () => {
        ctx.drawImage(
          image,
          0,
          0,
          backgroundCanvas.width,
          backgroundCanvas.height,
        );
      });
    };
    const w = width;
    const h = height;
    console.log('a');
    const backgroundCanvas = backgroundRef.current;
    if (backgroundCanvas) {
      console.log('b');
      backgroundCanvas.width = w;
      backgroundCanvas.height = h;
      drawBackground(backgroundCanvas);
    }
  }, [background]);
  return (
    <Box width="100%" height="100%" {...panResponder.panHandlers}>
      <Canvas ref={backgroundRef} style={{position: 'absolute'}} />
      <Canvas ref={textRef} style={{position: 'absolute'}} />
      <Canvas ref={canvasRef} style={{position: 'absolute'}} />
    </Box>
  );
};
export default DownloadAndReadingStoryScreen;
