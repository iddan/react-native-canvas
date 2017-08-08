import {webviewConstructor, webviewMethods, webviewRef, WEBVIEW_TARGET} from './webview-binders';

@webviewRef
@webviewMethods(['addColorStop'])
export default class CanvasGradient {
  constructor(context, id) {
    this.context = context;
    this[WEBVIEW_TARGET] = id;
  }
  postMessage(message) {
    this.context.postMessage(message);
  }
}
