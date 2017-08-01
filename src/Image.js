import {webviewConstructor, webviewProperties, webviewEvents} from './webview-binders';

@webviewProperties({crossOrigin: undefined, height: undefined, src: undefined, width: undefined})
@webviewEvents(['load', 'error'])
@webviewConstructor('Image')
export default class Image {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    if (this.onConstruction) {
      this.onConstruction();
    }
  }

  postMessage(message) {
    return this.canvas.postMessage(message);
  }

  onMessage(handleMessage) {
    return this.canvas.onMessage(handleMessage);
  }
}
