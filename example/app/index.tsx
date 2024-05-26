
import React, { ReactElement, useCallback } from 'react';
import {Text, Image, ScrollView, StatusBar, View, StyleSheet, ImageSourcePropType} from 'react-native';
import Canvas, {Image as CanvasImage, Path2D, ImageData} from 'react-native-canvas';

export default function HomeScreen() {
  const handleImageData = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');
    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    context.getImageData(0, 0, 100, 100).then(imageData => {
      const data = Object.values(imageData.data);
      const length = Object.keys(data).length;
      for (let i = 0; i < length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
      const imgData = new ImageData(canvas, data, 100, 100);
      context.putImageData(imgData, 0, 0);
    });
  }, [])

  const handlePurpleRect = useCallback(async (canvas: Canvas | null) => {
    if (!canvas) return;
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    const {width} = await context.measureText('yo');
  }, [])

  const handleRedCircle = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.arc(50, 50, 49, 0, Math.PI * 2, true);
    context.fill();
  }, [])

  const handleImageRect = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    image.src = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Biho_Takashi._Bat_Before_the_Moon%2C_ca._1910.jpg';
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });
  }, [])

  const handlePath = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.fillRect(0, 0, 100, 100);

    const ellipse = new Path2D(canvas);
    ellipse.ellipse(50, 50, 25, 35, (45 * Math.PI) / 180, 0, 2 * Math.PI);
    context.fillStyle = 'purple';
    context.fill(ellipse);

    context.save();
    context.scale(0.5, 0.5);
    context.translate(50, 20);
    const rectPath = new Path2D(canvas, 'M10 10 h 80 v 80 h -80 Z');

    context.fillStyle = 'pink';
    context.fill(rectPath);
    context.restore();
  }, [])

  const handleGradient = useCallback(async (canvas: Canvas | null) => {
    if (!canvas) return;
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    const gradient = await ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
  }, [])

  const handleEmbedHTML = useCallback((canvas: Canvas | null) => {
    if (!canvas) return;
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    const htmlString = '<b>Hello, World!</b>';
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px; background: lightblue; width: 100vw; height: 100vh;">
          <span style="background: pink;">
            ${htmlString}
          </span>
        </div>
    </foreignObject>
</svg>
`;
    image.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });
  }, [])


  return (
    <View style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView style={styles.examples}>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Text>Result</Text>
            </View>
            <View style={styles.exampleRight}>
              <Text>Expected</Text>
            </View>
          </View>
          <Example sample={require('../assets/images/purple-black-rect.png')}>
            <Canvas ref={handleImageData} />
          </Example>
          <Example sample={require('../assets/images/purple-rect.png')}>
            <Canvas ref={handlePurpleRect} />
          </Example>
          <Example sample={require('../assets/images/red-circle.png')}>
            <Canvas ref={handleRedCircle} />
          </Example>
          <Example sample={require('../assets/images/image-rect.png')}>
            <Canvas ref={handleImageRect} />
          </Example>
          <Example sample={require('../assets/images/path.png')}>
            <Canvas ref={handlePath} />
          </Example>
          <Example sample={require('../assets/images/gradient.png')}>
            <Canvas ref={handleGradient} />
          </Example>
          <Example sample={require('../assets/images/embed-html.png')}>
            <Canvas ref={handleEmbedHTML} />
          </Example>
        </ScrollView>
      </View>
  );
}

const Example = ({sample, children}: {sample: ImageSourcePropType, children: ReactElement}) => (
  <View style={styles.example}>
    <View style={styles.exampleLeft}>{children}</View>
    <View style={styles.exampleRight}>
      <Image source={sample} style={{width: 100, height: 100}} />
    </View>
  </View>
);

const commonStyles = StyleSheet.create({
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...commonStyles.full,
  },
  examples: {
    ...commonStyles.full,
    padding: 5,
    paddingBottom: 0,
  },
  example: {
    paddingBottom: 5,
    flex: 1,
    flexDirection: 'row',
  },
  exampleLeft: {
    ...commonStyles.cell,
  },
  exampleRight: {
    ...commonStyles.cell,
  },
});
