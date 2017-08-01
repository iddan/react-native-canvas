import React, {Component} from 'react';
import {Image, ScrollView, StatusBar, Text, View, StyleSheet} from 'react-native';

import Canvas, {Image as CanvasImage} from 'react-native-canvas';

class App extends Component {
  handlePurpleRect(canvas) {
    canvas.width = 100;
    canvas.height = 100;
    const image = new CanvasImage(canvas);
    console.log(image);

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);
  }

  handleRedCircle(canvas) {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.arc(50, 50, 49, 0, Math.PI * 2, true);
    context.fill();
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
