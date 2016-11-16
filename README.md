感谢原作者提供的这个精巧的小内容，我将它用ES6的规范重新改良了下，并且略微改动部分细节。

______

# Unmaintained
This module was developed as an experiment and isn't intended to be used in production. If you would like to do development on a module worthy of replacing this module on npm, please don't hesitate to get in touch and we can work out transferring this name to you.

# react-native-canvas

A canvas view for React Native. This module is currently in the very early stages of development. The code for this is pretty primitive right now. We `.toString()` the `render` method and write HTML into the DOM of the WebView. While this is acceptable, it prevents true interaction with the canvas. I'd like eventually to be able to maintain a reference to the canvas from within the React Native app.

## Getting started

1. `npm install react-native-canvas@latest --save`

## Usage

All you need is to `require` the `react-native-canvas` module and then use the
`<Canvas/>` tag.

```javascript
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View
} = React;
var Canvas = require('react-native-canvas');

function renderCanvas(canvas) {
  alert(this.message);
  // Canvas demo is from here: http://codepen.io/antoniskamamis/pen/ECrKd
  var ctx = canvas.getContext('2d'),
    particles = [],
    patriclesNum = 50,
    w = 200,
    h = 200,
    colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'];

  canvas.width = 200;
  canvas.height = 200;
  canvas.style.left = (window.innerWidth - 200)/2+'px';

  if(window.innerHeight>200)
  canvas.style.top = (window.innerHeight - 200)/2+'px';

  function Factory(){  
    this.x =  Math.round( Math.random() * w);
    this.y =  Math.round( Math.random() * h);
    this.rad = Math.round( Math.random() * 1) + 1;
    this.rgba = colors[ Math.round( Math.random() * 3) ];
    this.vx = Math.round( Math.random() * 3) - 1.5;
    this.vy = Math.round( Math.random() * 3) - 1.5;
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for(var i = 0;i < patriclesNum; i++){
      var temp = particles[i];
      var factor = 1;

      for(var j = 0; j<patriclesNum; j++){

         var temp2 = particles[j];
         ctx.linewidth = 0.5;

         if(temp.rgba == temp2.rgba && findDistance(temp, temp2)<50){
            ctx.strokeStyle = temp.rgba;
            ctx.beginPath();
            ctx.moveTo(temp.x, temp.y);
            ctx.lineTo(temp2.x, temp2.y);
            ctx.stroke();
            factor++;
         }
      }


      ctx.fillStyle = temp.rgba;
      ctx.strokeStyle = temp.rgba;

      ctx.beginPath();
      ctx.arc(temp.x, temp.y, temp.rad*factor, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(temp.x, temp.y, (temp.rad+5)*factor, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.closePath();


      temp.x += temp.vx;
      temp.y += temp.vy;

      if(temp.x > w)temp.x = 0;
      if(temp.x < 0)temp.x = w;
      if(temp.y > h)temp.y = 0;
      if(temp.y < 0)temp.y = h;
    }
  }

  function findDistance(p1,p2){  
    return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
  }

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  (function init(){
    for(var i = 0; i < patriclesNum; i++){
      particles.push(new Factory);
    }
  })();

  (function loop(){
    draw();
    requestAnimFrame(loop);
  })();
}

var canvasApp = React.createClass({
  render: function() {
    return (
      <View>
        <Canvas
          context={{message: 'Hello!'}}
          render={renderCanvas}
          style={{height: 200, width: 200}}
        />
      </View>
    );
  }
});

AppRegistry.registerComponent('canvasApp', () => canvasApp);
```

## Properties

#### `context`
The `context` property allows you to pass context to the `render` method. The `context` will be bound to the `render` method and thus will be available through `this`.

#### `render`

The `render` property is a method that will be invoked with a reference to the canvas as the first parameter. What you choose to do with the `canvas` property is up to you.

**Important:**

1.) The function you define for `render` **HAS NO SCOPE**. The function will be passed into a WebView as a string, and thus you will be unable to reference any variables that would typically be in scope if your render function was being executed normally. You do however have access to all the typical APIs available in a WebView.

2.) The function you define for `render` must exist in a context that won't cause problems. I'm not sure exactly what this means at the moment, but in some cases `func.toString()` returns `[native code]` - for me this happened when I tried adding the canvas render code as a component instance method. This didn't work, however moving the function to a global context (relative to the file) worked like a charm.
