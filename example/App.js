import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, View, StyleSheet} from 'react-native';

import Canvas, {Image as CanvasImage, Path2D, ImageData} from 'react-native-canvas';

const Example = ({sample, children}) => (
  <View style={styles.example}>
    <View style={styles.exampleLeft}>{children}</View>
    <View style={styles.exampleRight}>
      <Image source={sample} style={{width: 100, height: 100}} />
    </View>
  </View>
);

export default class App extends Component {
  handleImageData(canvas) {
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
  }

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

    image.src = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Biho_Takashi._Bat_Before_the_Moon%2C_ca._1910.jpg';
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });
  }

  handlePath(canvas) {
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

  handleEmbedHTML(canvas) {
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
  }
/**
 * For example used google font
 */
  handleCustomFont(canvas) {
    const image = new CanvasImage(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = 100;
    canvas.height = 100;

    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    canvas
      .addFont({
        name: 'Miss Fajardose',
        link: 'https://fonts.gstatic.com/l/font?kit=_Xmz-GY4rjmCbQfc-aPRaa4pqV340p7EZl5bwkcU4V55dc7XaVkOCo1Q-D-x1hYOZdAwD85gO8PnV3aw17Bcb_EJ-4NA_8H607rOs33MkhY8f7wbUWAdDQ2n1QB3eW3jcHe0AN51VVnuPiTMOVWKPaSDGFmHIHXVFubF6rRfNxY45LnE1RQ5DyQMd9Ji48bXLyygkZ3MoMVyaLdVNg8nVZJ-nR_Yf3UVbtEIyw&skey=f0bf0703ab573473&v=v7',
      })
      .then((res) => {
        ctx.font = 'bold 20px Miss Fajardose';
        ctx.fillText('Hello Font', 5, 52);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView style={styles.examples}>
          <Example sample={require('./images/purple-black-rect.png')}>
            <Canvas ref={this.handleImageData} />
          </Example>
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
          <Example sample={require('./images/embed-html.png')}>
            <Canvas ref={this.handleEmbedHTML} />
          </Example>
          <Example sample={require('./images/custom-font.png')}>
            <Canvas ref={this.handleCustomFont} />
          </Example>
        </ScrollView>
      </View>
    );
  }
}

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
