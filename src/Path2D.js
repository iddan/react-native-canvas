import {webviewConstructor, webviewMethods} from './webview-binders';

/**
 * Currently doesn't support passing an SVGMatrix in addPath as SVGMatrix is deprecated
 */
@webviewMethods([
  'addPath',
  'closePath',
  'moveTo',
  'lineTo',
  'bezierCurveTo',
  'quadraticCurveTo',
  'arc',
  'arcTo',
  'ellipse',
  'rect',
])
@webviewConstructor('Path2D')
export default class Path2D {
  constructor(canvas, ...args) {
    this.canvas = canvas;
    if (this.onConstruction) {
      this.onConstruction(...args);
    }
  }

  postMessage = message => {
    return this.canvas.postMessage(message);
  };

  addMessageListener = listener => {
    return this.canvas.addMessageListener(listener);
  };
}
