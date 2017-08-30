import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, Text, View, StyleSheet} from 'react-native';

import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';

class App extends Component {
  async handlePurpleRect(canvas) {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    const {width} = await context.measureText('yo');
    console.log(width);
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
              <Image source={require('./images/image-rect.png')} style={{width: 100, height: 100}} />
            </View>
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
