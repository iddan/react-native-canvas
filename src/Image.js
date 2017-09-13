import {webviewConstructor, webviewProperties, webviewEvents} from './webview-binders';

@webviewProperties({crossOrigin: undefined, height: undefined, src: undefined, width: undefined})
@webviewEvents(['load', 'error'])
@webviewConstructor('Image')
export default class Image {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    if (this.onConstruction) {
      this.onConstruction();
    }
    if (this.width) {
      this.width = width;
    }
    if (this.height) {
      this.height = height;
    }
  }

  postMessage = message => {
    return this.canvas.postMessage(message);
  };

  addMessageListener = listener => {
    return this.canvas.addMessageListener(listener);
  };
}
