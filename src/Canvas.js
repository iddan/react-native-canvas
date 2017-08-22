import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, WebView, ViewStylePropTypes} from 'react-native';
import {webviewTarget, webviewProperties, webviewMethods} from './webview-binders';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';
export {default as Image} from './Image';

let _messageId = 0;

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
          style={{width, height, backgroundColor: 'transparent'}}
          source={require('./index.html')}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
        />
      </View>
    );
  }
}
