# react-native-canvas

A canvas view for React Native. This module is currently in the very early stages of development.

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

var canvasApp = React.createClass({
  render: function() {
    return (
      <View>
        <Canvas
          context={{message: 'Hello!'}}
          render={this._renderCanvas}
          style={{height: 200, width: 200}}
        />
      </View>
    );
  },
  _renderCanvas: function(canvas) {
    alert(this.message);
    var ctx = canvas.getContext('2d'),
      particles = [],
      patriclesNum = 100,
      w = 200,
      h = 200,
      colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'];

    canvas.width = 200;
    canvas.height = 200;
    canvas.style.left = (window.innerWidth - 500)/2+'px';

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
});

AppRegistry.registerComponent('canvasApp', () => canvasApp);
```

## Properties

#### `context`
The `context` property allows you to pass context to the `render` method. The `context` will be bound to the `render` method and thus will be available through `this`.

#### `render`

The `render` property is a method that will be invoked with a reference to the canvas as the first parameter. What you choose to do with the `canvas` property is up to you.

**Important: The function you define for `render` HAS NO SCOPE. The function will be passed into a WebView as a string, and thus you will be unable to reference any variables that would typically be in scope if your render function was being executed normally. You do however have access to all the typical APIs available in a WebView.**
