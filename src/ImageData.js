import Canvas from './Canvas';
import {webviewConstructor} from './webview-binders';

@webviewConstructor('ImageData')
export default class ImageData {
  constructor(canvas, array, width, height) {
    if (!(canvas instanceof Canvas)) {
      throw new Error('ImageData must be initialized with a Canvas instance');
    }
    this.canvas = canvas;
    if (this.onConstruction) {
      const typedArray = {
        type: 'Uint8ClampedArray',
        params: [array],
      };
      this.onConstruction(typedArray, width, height);
    }
  }

  postMessage = message => {
    return this.canvas.postMessage(message);
  };

  addMessageListener = listener => {
    return this.canvas.addMessageListener(listener);
  };
}
