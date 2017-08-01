import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, WebView, ViewStylePropTypes} from 'react-native';
import {webviewTarget, webviewProperties, webviewMethods} from './webview-binders';
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

@webviewTarget('canvas')
@webviewProperties({width: 300, height: 150})
@webviewMethods(['toDataURL'])
export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.shape(ViewStylePropTypes),
  };

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
