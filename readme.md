<div align="center">
<img src="https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/96/fireworks_1f386.png"/>
<h1>react-native-canvas</h1>
</div>

A Canvas component for React Native

```bash
npm install react-native-webview
react-native link react-native-webview
npm install react-native-canvas
```

### Usage

```JSX
import React, { Component } from 'react';
import Canvas from 'react-native-canvas';

class App extends Component {

  handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  }

  render() {
    return (
      <Canvas ref={this.handleCanvas}/>
    )
  }
}
```

### API

#### Canvas

###### Canvas#height

Reflects the height of the canvas in pixels

###### Canvas#width

Reflects the width of the canvas in pixels

###### Canvas#getContext()

Returns a canvas rendering context. Currently only supports 2d context.

###### Canvas#toDataURL()

Returns a `Promise` that resolves to DataURL.

### Canvas#addFont(font)

`font` is an object that described bellow
```JS
const font = {
  name: 'Miss Fajardose', // required
  link: 'https://fonts.gstatic.com/s/missfajardose/v8/E21-_dn5gvrawDdPFVl-N0Ajb_qoUverqJnp.woff2', // required
  options: { // optional
    style: 'normal',
    weight: 500,
  }
};

canvas
  .addFont(font)
  .then(() => {
    console.log('Font has been added');
  });


```
Returns a `Promise` after loading font


#### Canvas#initFonts(fonts)

`fonts` are an array of objects that described above
```JS
const fonts = [font1, font2, ...];

canvas
  .initFonts(fonts)
  .then(() => {
    console.log('Fonts h');
  });

```
Returns a `Promise` after loading all fonts


#### CanvasRenderingContext2D

Standard CanvasRenderingContext2D. [MDN](https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D). Only difference is `await` should be used to retrieve values from methods.

```javascript
const ctx = canvas.getContext('2d');
```

#### Image

WebView Image constructor. Unlike in the browsers accepts canvas as first argument. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image)

```javascript
const image = new Image(canvas, height, width);
```

#### Path2D

Path2D API constructor. Unlike in the browsers, this requires the canvas as first argument. See also https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D.

```javascript
const path = new Path2D(canvas);
```
