import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, WebView, ViewStylePropTypes} from 'react-native';
import {webviewTarget, webviewProperties, webviewMethods} from './webview-binders';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';
export {default as Image} from './Image';
export {default as Path2D} from './Path2D';

let _messageId = 0;

const js = `
const flattenObject = object => {
  if (typeof object !== 'object') {
    return object;
  }
  const flatObject = {};
  for (const key in object) {
    flatObject[key] = object[key];
  }
  for (const key in Object.getOwnPropertyNames(object)) {
    flatObject[key] = object[key];
  }
  return flatObject;
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
    payload: flattenObject(result),
  };
};

const canvas = document.createElement('canvas');

const targets = {
  canvas,
  context2D: canvas.getContext('2d'),
};

const constructors = {
  Image,
  Path2D,
};

const populateRefs = arg => {
  if (arg.__ref__) {
    return targets[arg.__ref__];
  }
  return arg;
};

document.body.appendChild(canvas);

document.addEventListener('message', (e) => {
  const {id, type, payload} = JSON.parse(e.data)
  switch (type) {
    case 'exec': {
      const {target, method, args} = payload;
      const result = targets[target][method](...args.map(populateRefs));
      const message = toMessage(result);
      postMessage(JSON.stringify(Object.assign({ id }, message)));
      break;
    }
    case 'set': {
      const {target, key, value} = payload;
      targets[target][key] = value;
      break;
    } 
    case 'construct': {
      const {constructor, id: target, args = []} = payload;
      const object = new constructors[constructor](...args);
      const message = toMessage({});
      targets[target] = object;
      postMessage(JSON.stringify(Object.assign({ id }, message)));
      break;
    } 
    case 'listen': {
      const {types, target} = payload;
      for (const eventType of types) {
        targets[target].addEventListener(eventType, e => {
          const message = toMessage({
            type: 'event',
            payload: {
              type: e.type,
            },
          });
          postMessage(JSON.stringify(Object.assign({ id }, message)));
        });
      }
      break;
    } 
  }
})
`;

const html = `
<!doctype html>
  <html>
    <head>
      <style>
        html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
        }
      </style>
    </head>
    <body leftmargin="0" topmargin="0" rightmargin="0" bottommargin="0">
      <script>${js}</script>
    </body>
  </html>
`;

class Bus {
  queued = [];
  paused = false;

  constructor(send, listen) {
    this._send = send;
    this._listen = listen;
  }

  send = message =>
    new Promise(resolve => {
      const _id = ++_messageId;
      const unlisten = this._listen((id, response) => {
        if (id === _id) {
          resolve(response);
          unlisten();
        }
      });
      if (this.paused) {
        this.queued.push(() => {
          this._send(JSON.stringify({id: _id, ...message}));
        });
      } else {
        this._send(JSON.stringify({id: _id, ...message}));
      }
    });

  pause = () => {
    this.paused = true;
  };

  resume = () => {
    this.paused = false;
    for (const callback of this.queued) {
      callback();
    }
    this.queued = [];
  };
}

@webviewTarget('canvas')
@webviewProperties({width: 300, height: 150})
@webviewMethods(['toDataURL'])
export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.shape(ViewStylePropTypes),
  };

  addMessageListener = listener => {
    this.listeners.push(listener);
    return () => this.removeMessageListener(listener);
  };

  removeMessageListener = listener => {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  };

  loaded = false;
  /**
   * in the mounting process this.webview can be set to null
   */
  webviewPostMessage = message => this.webview && this.webview.postMessage(message);
  bus = new Bus(this.webviewPostMessage, this.addMessageListener);
  listeners = [];
  context2D = new CanvasRenderingContext2D(this);

  constructor() {
    super();
    this.bus.pause();
  }

  getContext = (contextType, contextAttributes) => {
    switch (contextType) {
      case '2d': {
        return this.context2D;
      }
    }
    return null;
  };

  postMessage = message => {
    return this.bus.send(message);
  };

  handleMessage = e => {
    const {id, type, payload} = JSON.parse(e.nativeEvent.data);
    for (const listener of this.listeners) {
      switch (type) {
        case 'json': {
          listener(id, payload);
          break;
        }
        case 'blob': {
          listener(id, atob(payload));
          break;
        }
      }
    }
  };

  handleRef = element => {
    this.webview = element;
  };

  handleLoad = () => {
    this.loaded = true;
    this.bus.resume();
  };

  render() {
    const {width, height} = this;
    const {style} = this.props;
    return (
      <View style={{width, height, overflow: 'hidden', flex: 0, ...style}}>
        <WebView
          ref={this.handleRef}
          style={{width, height, overflow: 'hidden', backgroundColor: 'transparent'}}
          source={{html, baseUrl: '/'}}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
          scrollEnabled={false}
        />
      </View>
    );
  }
}
