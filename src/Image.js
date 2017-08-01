import {webviewConstructor, webviewProperties, webviewEvents} from './webview-binders';

@webviewConstructor('Image')
@webviewProperties({crossOrigin: undefined, height: undefined, src: undefined, width: undefined})
@webviewEvents(['load', 'error'])
export default class Image {
  constructor(canvas, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
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
