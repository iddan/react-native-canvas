import React, {Component} from 'react';
import {WebView} from 'react-native';
import defineWebViewMethods from './defineWebViewMethods';
import defineWebViewProperties from './defineWebViewProperties';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';

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
      <WebView
        ref={this.handleRef}
        style={{width, height, flexGrow: 1, flexShrink: 1, backgroundColor: 'transparent'}}
        source={require('./index.html')}
        onMessage={this.handleMessage}
        onLoad={this.handleLoad}
      />
    );
  }
}
