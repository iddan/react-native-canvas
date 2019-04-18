import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Platform, ViewStylePropTypes, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import Bus from './Bus';
import {webviewTarget, webviewProperties, webviewMethods, constructors, WEBVIEW_TARGET} from './webview-binders';
import CanvasRenderingContext2D from './CanvasRenderingContext2D';
import html from './index.html.js';
export {default as Image} from './Image';
export {default as ImageData} from './ImageData';
export {default as Path2D} from './Path2D';
import './CanvasGradient';

const stylesheet = StyleSheet.create({
  container: {overflow: 'hidden', flex: 0},
  webview: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    flex: 0,
  },
});

@webviewTarget('canvas')
@webviewProperties({width: 300, height: 150})
@webviewMethods(['toDataURL', 'initFonts', 'addFont'])
export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.shape(ViewStylePropTypes),
    baseUrl: PropTypes.string,
    originWhitelist: PropTypes.arrayOf(PropTypes.string),
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
  webviewPostMessage = message => this.webview && this.webview.postMessage(JSON.stringify(message));

  bus = new Bus(this.webviewPostMessage);
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

      default: {
        return null;
      }
    }
  };

  postMessage = async message => {
    const {stack} = new Error();
    const {type, payload} = await this.bus.post({id: Math.random(), ...message});
    switch (type) {
      case 'error': {
        const error = new Error(payload.message);
        error.stack = stack;
        throw error;
      }
      case 'json': {
        return payload;
      }
      case 'blob': {
        return atob(payload);
      }
    }
  };

  handleMessage = e => {
    let data = JSON.parse(e.nativeEvent.data);
    switch (data.type) {
      case 'log': {
        // eslint-disable-line no-console
        console.log(...data.payload);
        break;
      }
      case 'error': {
        throw new Error(data.payload.message);
      }
      default: {
        if (data.payload) {
          const constructor = constructors[data.meta.constructor];
          if (constructor) {
            const {args, payload} = data;
            data = {
              ...data,
              payload: Object.assign(new constructor(this, ...args), payload, {[WEBVIEW_TARGET]: data.meta.target}),
            };
          }
          for (const listener of this.listeners) {
            listener(data.payload);
          }
        }
        this.bus.handle(data);
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
    const {style, baseUrl = '', originWhitelist = ['*']} = this.props;
    if (Platform.OS === 'android') {
      return (
        <View style={[stylesheet.container, {width, height}, style]}>
          <WebView
            ref={this.handleRef}
            style={[stylesheet.webview, {height, width}]}
            source={{html, baseUrl}}
            originWhitelist={originWhitelist}
            onMessage={this.handleMessage}
            onLoad={this.handleLoad}
            mixedContentMode="always"
            scalesPageToFit={false}
            javaScriptEnabled
            domStorageEnabled
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
          />
        </View>
      );
    }
    return (
      <View style={[stylesheet.container, {width, height}, style]}>
        <WebView
          ref={this.handleRef}
          style={[stylesheet.webview, {height, width}]}
          source={{html, baseUrl}}
          originWhitelist={originWhitelist}
          onMessage={this.handleMessage}
          onLoad={this.handleLoad}
          scrollEnabled={false}
        />
      </View>
    );
  }
}
