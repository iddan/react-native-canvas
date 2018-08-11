import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, Text, View, StyleSheet} from 'react-native';

import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';

const Example = ({sample, children}) => (
  <View style={styles.example}>
    <View style={styles.exampleLeft}>{children}</View>
    <View style={styles.exampleRight}>
      <Image source={sample} style={{width: 100, height: 100}} />
    </View>
  </View>
);

class App extends Component {
  async handlePurpleRect(canvas) {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    const {width} = await context.measureText('yo');
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

  handleEmbedHTML(canvas) {
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    const htmlString = '<b>Hello, World!</b>';
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px; background: lightblue; height: 100%;">
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
          <Example sample={require('./images/purple-rect.png')}>
            <Canvas ref={this.handlePurpleRect} />
          </Example>
          <Example sample={require('./images/red-circle.png')}>
            <Canvas ref={this.handleRedCircle} />
          </Example>
          <Example sample={require('./images/image-rect.png')}>
            <Canvas ref={this.handleImageRect} />
          </Example>
          <Example sample={require('./images/path.png')}>
            <Canvas ref={this.handlePath} />
          </Example>
          <Example sample={require('./images/gradient.png')}>
            <Canvas ref={this.handleGradient} />
          </Example>
          <Example sample={require('./images/panorama.png')}>
            <Canvas ref={this.handlePanorama} />
          </Example>
          <Example sample={require('./images/embed-html.png')}>
            <Canvas ref={this.handleEmbedHTML} />
          </Example>
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
