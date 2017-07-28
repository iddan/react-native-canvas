import React, {Component} from 'react';
import {View,WebView} from 'react-native';
import defineWebViewMethods from './defineWebViewMethods';
import defineWebViewProperties from './defineWebViewProperties';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';

const html = `
<html>
  <body style="margin: 0; padding: 0;">
    <script>
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const targets = {
      canvas,
      context2D: canvas.getContext('2d'),
    };

    const toMessage = result => {
      if (result instanceof Blob) {
        return {
          type: 'blob',
          payload: btoa(result),
        };
      }
      return {
        type: 'json',
        payload: JSON.stringify(result),
      };
    };

    document.addEventListener('message', e => {
      const {type, payload} = JSON.parse(e.data);
      try {
        switch (type) {
          case 'exec': {
            const {target, method, args} = payload;

            // let's create a special context for drawImage, which allows
            // base64 data as a source...

            if (method === 'drawImage' && args.length > 0 && args[0].indexOf('data:') === 0) {
                const image = new Image();

                image.addEventListener("load", function() {
                    targets[target].drawImage(image, ...args.slice(1));
                });

                image.src = args[0];
                break;
            } else {
                const result = targets[target][method](...args);
                const message = toMessage(result);
                postMessage(JSON.stringify(message));
                break;
            }
          }
          case 'set': {
            const {target, key, value} = payload;
            targets[target][key] = value;
            break;
          }
        }
      } catch (err) {
        document.body.innerHTML = '<div class="error">' + err + '</div>';
      }
    });

    </script>
  </body>
</html>
`

class Bus {
  actions = [];
  messageListeners = [];

  popActions = () => {
    for (const action of this.actions) {
      action();
    }
    this.actions = [];
  };

  pushMessage = message => {
    const listener = this.messageListeners.pop();
    listener(message);
  };

  getNextMessage = () =>
    new Promise(resolve => {
      this.messageListeners.push(resolve);
    });
}

@defineWebViewProperties('canvas', {width: 300, height: 150})
@defineWebViewMethods('canvas', ['toDataURL'])
export default class Canvas extends Component {
  loaded = false;
  bus = new Bus();
  context2D = new CanvasRenderingContext2D(this);

  getContext = (contextType, contextAttributes) => {
    switch (contextType) {
      case '2d': {
        return this.context2D;
      }
    }
    return null;
  };

  queue = action => {
    if (this.loaded) {
      action();
    }
    this.bus.actions.push(action);
  };

  postMessage = message => {
    this.queue(() => this.webview.postMessage(JSON.stringify(message)));
    return this.bus.getNextMessage().then(({type, payload}) => {
      switch (type) {
        case 'json': {
          return payload;
        }
        case 'blob': {
          return atob(payload);
        }
      }
    });
  };

  handleMessage = e => {
    this.bus.pushMessage(JSON.parse(e.nativeEvent.data));
  };

  handleRef = element => {
    this.webview = element;
  };

  handleLoad = () => {
    this.loaded = true;
    this.bus.popActions();
  };

  render() {
    const {width, height} = this;
    return (
      <View style={{width, height, overflow: 'hidden'}}>
        <WebView
          ref={this.handleRef}
          style={{width, height, backgroundColor: 'transparent'}}
          source={{html, baseUrl: '/'}}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
        />
      </View>
    );
  }
}
