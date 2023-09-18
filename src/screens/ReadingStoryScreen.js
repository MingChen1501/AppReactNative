import React, {useEffect, useRef, useState} from 'react';
import {Box, Fab, FabLabel, Text} from '@gluestack-ui/themed';
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
  const [{data, isLoading, error}, fetchData] = useFetchStory(
    `${uri}/api/pages/${page.id}?embed=texts`,
    responsePayload,
  );
  console.log('id: ', page.id);
  console.log('pages: ', pages);
  console.log('index: ', page.index);
  let strokes = [];
  let timeoutId;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: async (_event, gestureState) => {
      const drawText = async state => {
        const canvas = canvasRef.current;
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
            // sound.play();
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
      await drawText(await isPositionInsideStroke(gestureState, strokes));
    },
    onPanResponderMove: (event, gestureState) => {},
    onPanResponderRelease: (event, gestureState) => {
      const {dx, dy} = gestureState;
      const horizontalSwipe = Math.abs(dx) > Math.abs(dy);
      if (horizontalSwipe) {
        const tmp = 0.2 * width;
        console.log('log', dx, dy);
        if (dx > tmp) {
          if (page.index > 0) {
            console.log('right');
            setPage({id: pages[page.index - 1], index: page.index - 1});
          }
          // fetchData();
        } else if (dx < -tmp) {
          if (page.index < pages.length - 1) {
            console.log('left');
            setPage({id: pages[page.index + 1], index: page.index + 1});
          }
          // fetchData();
        }
      } else {
        const tmp = 0.4 * height;
        if (dy > tmp) {
          fetchData();
        }
      }
    },
    //TODO:impl swipe to forward or back page
  });
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const drawBackground = async background => {
      strokes = [];
      const ctx = background.getContext('2d');
      const image = new CanvasImage(background);
      const textData = data.text_configs[0];
      image.src = data.background;
      image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, background.width, background.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(textData.text.text, background.width - 661, 93);
        if (textData.text?.audio?.url) {
          const audio = new Sound(
            data.text_configs[0].text.audio.url,
            null,
            () => {
              audio.play(success => {
                console.log(audio);
                if (!success) {
                  console.log('playback failed due to audio decoding errors');
                } else {
                  console.log('successfully finished playing');
                }
              });
            },
          );
        }
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
          strokes.push({ref: stroke, index: index});
        });
        console.log(strokes);
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
        onPress={() => {}}>
        <FabLabel>Menu</FabLabel>
      </Fab>
    </Box>
  );
};
export default ReadingStoryScreen;
