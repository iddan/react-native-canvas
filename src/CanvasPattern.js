import {webviewRef, WEBVIEW_TARGET} from './webview-binders';

@webviewRef
export default class CanvasPattern {
  constructor(context, id) {
    this.context = context;
    this[WEBVIEW_TARGET] = id;
  }
}
