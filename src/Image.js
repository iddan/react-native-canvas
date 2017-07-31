import defineWebViewConstructor from './defineWebViewConstructor';
import defineWebViewProperties from './defineWebViewProperties';
import defineWebViewEvents from './defineWebViewEvents';

@defineWebViewConstructor
@defineWebViewProperties(['crossOrigin', 'height', 'src', 'width'])
@defineWebViewEvents(['load', 'error'])
export default class Image {
  constructor(canvas, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
  }

  postMessage(message) {
    return this.canvas.postMessage(message);
  }

  onload() {}

  onerror() {}
}
