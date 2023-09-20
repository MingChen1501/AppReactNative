import React, {useEffect, useRef, useState} from 'react';
import {Box, Text} from '@gluestack-ui/themed';
import Sound from 'react-native-sound';
import useFetchStory from '../hooks/UseFetch';
import {uri} from '../utils/Host';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
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
  const [page, setPage] = useState({id: pages[0], index: 0});
  const [isLoadedTextContentAudio, setIsLoadedTextContentAudio] = useState({
    isLoaded: false,
    sound: null,
  });
  const [isRefreshTextContent, setIsRefreshTextContent] = useState(false);
  const [{data, isLoading, error}, fetchData] = useFetchStory(
    `${uri}/api/pages/${page.id}?embed=texts`,
    responsePayload,
  );
  const textRef = useRef(null);
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  const strokes = useRef([]);
  const animationFrameId = useRef(null);
  let timeoutId;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: async (_event, gestureState) => {
      const drawText = async state => {
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        if (canvas) {
          //TODO: should be check gestureState position in touchable object position
          if (state.index > -1) {
            const ctx = canvas.getContext('2d');
            ctx.font = '16px serif';
            clearTimeout(timeoutId);
            ctx.clearRect(0, 0, width, height);
            const textMetrics = await ctx.measureText(
              data.touchable_objects[state.index].text.text,
            );
            ctx.fillText(
              data.touchable_objects[state.index].text.text,
              state.position.x0,
              state.position.y0,
            );
            const x = state.position.x0;
            const y = state.position.y0;
            strokeRoundRect(x - 5, y - 24, textMetrics.width + 10, 32, 10);
            const sound = new Sound(
              data.touchable_objects[state.index].text.audio.url,
              null,
              () => {
                sound.play();
              },
            );
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
        }
      };
      const isPositionInsideStroke = (position, strokesRef) => {
        return new Promise(resolve => {
          const canvas = backgroundRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const checkStrokes = async () => {
              for (const element of strokesRef) {
                const isInPath = await ctx.isPointInPath(
                  element.ref,
                  position.x0,
                  position.y0,
                );
                if (isInPath === 'true') {
                  resolve({isInPath: true, index: element.index, position});
                  return;
                }
              }
              resolve({isInPath: false, index: -1, position});
            };
            checkStrokes();
          } else {
            resolve({isInPath: false, index: -1, position});
          }
        });
      };
      await drawText(
        await isPositionInsideStroke(gestureState, strokes.current),
      );
    },
    onPanResponderMove: (event, gestureState) => {},
    onPanResponderRelease: (event, gestureState) => {
      const {dx, dy} = gestureState;
      const horizontalSwipe = Math.abs(dx) > Math.abs(dy);
      if (horizontalSwipe) {
        const tmp = 0.2 * width;
        if (dx > tmp) {
          if (page.index > 0) {
            const canvas = textRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            isLoadedTextContentAudio.sound.stop();
            cancelAnimationFrame(animationFrameId.current);
            setPage({id: pages[page.index - 1], index: page.index - 1});
          }
        } else if (dx < -tmp) {
          if (page.index < pages.length - 1) {
            const canvas = textRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            isLoadedTextContentAudio.sound.stop();
            cancelAnimationFrame(animationFrameId.current);
            setPage({id: pages[page.index + 1], index: page.index + 1});
          }
        }
      } else {
        const tmp = 0.4 * height;
        if (dy > tmp) {
          isLoadedTextContentAudio.sound.stop();
          cancelAnimationFrame(animationFrameId.current);
          setIsRefreshTextContent(!isRefreshTextContent);
        }
      }
    },
  });
  useEffect(() => {
    const drawBackground = async background => {
      strokes.current = [];
      const ctx = background.getContext('2d');
      const image = new CanvasImage(background);
      image.src = data.background;
      ctx.clearRect(0, 0, background.width, background.height);
      const sound = new Sound(data.text_configs[0].text.audio.url, null, e => {
        if (e) {
          return;
        }
        setIsLoadedTextContentAudio({isLoaded: true, sound: sound});
      });
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, background.width, background.height);
      });
      const touchableObjectPosition = data.touchable_objects.map(e => {
        return JSON.parse(e.position);
      });
      touchableObjectPosition.map(async (e, index) => {
        const stroke = new Path2D(ctx);
        ctx.beginPath();
        e.forEach(vertice => {
          const x = (vertice.x * width) / 1700;
          const y = (vertice.y * height) / 768;
          if (vertice === e[0]) {
            stroke.moveTo(x, height - y);
          } else {
            stroke.lineTo(x, height - y);
          }
        });
        ctx.closePath();
        strokes.current.push({ref: stroke, index: index});
      });
    };
    const w = width;
    const h = height;
    const backgroundCanvas = backgroundRef.current;
    if (backgroundCanvas) {
      backgroundCanvas.width = w;
      backgroundCanvas.height = h;
      drawBackground(backgroundCanvas);
    }
  }, [isLoading, data]);
  useEffect(() => {
    const drawTextContent = async textCanvas => {
      if (!isLoadedTextContentAudio.isLoaded) {
        return;
      }
      isLoadedTextContentAudio.sound.play();
      const textCtx = textCanvas.getContext('2d');
      textCtx.font = '20px Arial';
      const text = data.text_configs[0].text.text;
      const measureText = await textCtx.measureText(text);
      const words = text.split(' ');
      const textPosition = [];
      for (const word of words) {
        const measureWord = await textCtx.measureText(word + ' ');
        textPosition.push(measureWord.width);
      }
      const syncTextSounds = JSON.parse(
        data.text_configs[0].text.audio.sync_text_sound,
      );
      const highlightDurations = syncTextSounds.map(item => {
        const duration = item.te - item.ts;
        return duration * 100;
      });
      let currentIndex = 0;
      let startTime = null;
      const animate = () => {
        const currentTime = Date.now();
        if (!startTime) {
          startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
        let x = (width - measureText.width) / 2;
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const isHighlighted =
            i === currentIndex &&
            elapsedTime >= 0 &&
            elapsedTime < highlightDurations[i];
          if (isHighlighted) {
            textCtx.fillStyle = 'red';
          } else {
            textCtx.fillStyle = 'black';
          }
          textCtx.fillText(word, x, 30);
          x += textPosition[i];
        }
        if (elapsedTime >= highlightDurations[currentIndex]) {
          currentIndex++;
          startTime = null;
        }
        if (currentIndex < words.length) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          textCtx.clearRect(0, 0, width, height);
          textCtx.fillText(text, (width - measureText.width) / 2, 30);
          // renderCtx.drawImage(textCanvas, 0, 0);
        }
      };
      animationFrameId.current = requestAnimationFrame(animate);
    };
    const textCanvas = textRef.current;
    if (textCanvas) {
      textCanvas.width = width;
      textCanvas.height = height;
      drawTextContent(textCanvas);
    }
    return cancelAnimationFrame(animationFrameId.current);
  }, [isLoadedTextContentAudio, isRefreshTextContent]);
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
      <Canvas ref={backgroundRef} style={{position: 'absolute'}} />
      <Canvas ref={textRef} style={{position: 'absolute'}} />
      <Canvas ref={canvasRef} style={{position: 'absolute'}} />
      {/* <Fab
        size="sm"
        placement="top right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => {}}>
        <FabLabel>Menu</FabLabel>
      </Fab> */}
    </Box>
  );
};
export default ReadingStoryScreen;
