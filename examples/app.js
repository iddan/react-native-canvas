import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, Text, View, StyleSheet} from 'react-native';

import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';

const MyCanvas = ({onRender, style = {}, ...rest}) => {
  const width = style.width || 300;
  const height = style.height || 150;
  return (
    <Canvas ref={onRender} {...{style: {...style, width, height}, ...rest}} />
  );
};

const handleCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  const ratio = 2;
  ctx.width = canvas.width;
  ctx.height = canvas.height;

  ctx.width *= ratio;
  ctx.height *= ratio;

  ctx.fillStyle = 'purple';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(ratio, ratio);
  console.log('handleCanvas', canvas.width, canvas.height, ctx.width, ctx.height);
};

class App extends Component {
  async handlePurpleRect(canvas) {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    const {width} = await context.measureText('yo');
    console.log('"yo" text rendering width', width);
  }

  handleRedCircle(canvas) {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.arc(50, 50, 49, 0, Math.PI * 2, true);
    context.fill();
  }

  handleImageRect(canvas) {
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    image.src = 'https://image.freepik.com/free-vector/unicorn-background-design_1324-79.jpg';
    image.addEventListener('load', () => {
      console.log('image is loaded');
      context.drawImage(image, 0, 0, 100, 100);
    });
  }

  async handlePath(canvas) {
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.fillRect(0, 0, 100, 100);

    const ellipse = new Path2D(canvas);
    ellipse.ellipse(50, 50, 25, 35, 45 * Math.PI / 180, 0, 2 * Math.PI);
    context.fillStyle = 'purple';
    context.fill(ellipse);

    context.save();
    context.scale(0.5, 0.5);
    context.translate(50, 20);
    const rectPath = new Path2D(canvas, 'M10 10 h 80 v 80 h -80 Z');

    console.log('Is 0, 0 in the rectangle', await context.isPointInPath(rectPath, 0, 0));
    console.log('Is 50, 50 in the rectangle', await context.isPointInPath(rectPath, 50, 50));

    context.fillStyle = 'pink';
    context.fill(rectPath);
    context.restore();
  }

  async handleGradient(canvas) {
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    const gradient = await ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
  }

  /**
   * Extracted from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
   */
  handlePanorama(canvas) {
    const CanvasXSize = 100;
    const CanvasYSize = 100;
    canvas.width = CanvasXSize;
    canvas.height = CanvasYSize;
    const ctx = canvas.getContext('2d');
    const img = new CanvasImage(canvas);

    // User Variables - customize these to change the image being scrolled, its
    // direction, and the speed.

    img.src = 'https://mdn.mozillademos.org/files/4553/Capitan_Meadows,_Yosemite_National_Park.jpg';
    const speed = 30; // lower is faster
    const scale = 1.05;
    const y = -4.5; // vertical offset

    // Main program

    const dx = 0.75;
    let imgW;
    let imgH;
    let x = 0;
    let clearX;
    let clearY;

    img.addEventListener('load', () => {
      imgW = img.width * scale;
      imgH = img.height * scale;

      if (imgW > CanvasXSize) {
        x = CanvasXSize - imgW;
      } // image larger than canvas
      if (imgW > CanvasXSize) {
        clearX = imgW;
      } else {
        // image width larger than canvas
        clearX = CanvasXSize;
      }
      if (imgH > CanvasYSize) {
        clearY = imgH;
      } else {
        // image height larger than canvas
        clearY = CanvasYSize;
      }

      // set refresh rate
      return setInterval(draw, speed);
    });

    function draw() {
      ctx.clearRect(0, 0, clearX, clearY); // clear the canvas

      // if image is <= Canvas Size
      if (imgW <= CanvasXSize) {
        // reset, start from beginning
        if (x > CanvasXSize) {
          x = -imgW + x;
        }
        // draw additional image1
        if (x > 0) {
          ctx.drawImage(img, -imgW + x, y, imgW, imgH);
        }
        // draw additional image2
        if (x - imgW > 0) {
          ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
        }
      } else {
        // if image is > Canvas Size
        // reset, start from beginning
        if (x > CanvasXSize) {
          x = CanvasXSize - imgW;
        }
        // draw additional image
        if (x > CanvasXSize - imgW) {
          ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
        }
      }
      // draw image
      ctx.drawImage(img, x, y, imgW, imgH);
      // amount to move
      x += dx;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView style={styles.examples}>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Text>Example</Text>
            </View>
            <View style={styles.exampleRight}>
              <Text>Sample</Text>
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handlePurpleRect} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/purple-rect.png')} />
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handleRedCircle} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/red-circle.png')} />
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handleImageRect} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/image-rect.png')} style={{width: 100, height: 100}} />
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handlePath} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/path.png')} style={{width: 100, height: 100}} />
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handleGradient} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/gradient.png')} style={{width: 100, height: 100}} />
            </View>
          </View>
          <View style={styles.example}>
            <View style={styles.exampleLeft}>
              <Canvas ref={this.handlePanorama} />
            </View>
            <View style={styles.exampleRight}>
              <Image source={require('./images/panorama.png')} style={{width: 100, height: 100}} />
            </View>
          </View>
          <View style={styles.example}>
            <MyCanvas onRender={handleCanvas} {...{style: {width: 320, height: 200}}}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const full = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

const cell = {
  flex: 1,
  padding: 10,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  container: {
    ...full,
  },
  examples: {
    ...full,
    padding: 5,
    paddingBottom: 0,
  },
  example: {
    paddingBottom: 5,
    flex: 1,
    flexDirection: 'row',
  },
  exampleLeft: {
    ...cell,
  },
  exampleRight: {
    ...cell,
  },
});

export default App;
