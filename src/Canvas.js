import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, WebView, ViewStylePropTypes} from 'react-native';
import {webviewTarget, webviewProperties, webviewMethods} from './webview-binders';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';
export {default as Image} from './Image';

class Bus {
  queued = [];
  paused = false;

  constructor(send, listen) {
    this._send = send;
    this._listen = listen;
  }

  send = message =>
    new Promise(resolve => {
      if (this.paused) {
        this.queued.push({message, resolve});
        return;
      }
      this._send(message);
      const unlisten = this._listen(response => {
        resolve(response);
        unlisten();
      });
    });

  pause = () => {
    this.paused = true;
  };

  resume = () => {
    this.paused = false;
    for (const {message, resolve} of this.queued) {
      resolve(this.send(message));
    }
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
  bus = new Bus(message => this.webview.postMessage(message), this.addMessageListener);
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
    return this.bus.send(JSON.stringify(message)).then(({type, payload}) => {
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
    for (const listener of this.listeners) {
      listener(JSON.parse(e.nativeEvent.data));
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
          style={{width, height, backgroundColor: 'transparent'}}
          source={require('./index.html')}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
        />
      </View>
    );
  }
}
