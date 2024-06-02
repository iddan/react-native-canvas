import { webviewConstructor, webviewMethods } from "./webview-binders";

@webviewMethods(["addColorStop"])
@webviewConstructor("CanvasGradient")
export default class CanvasGradient {
  constructor(canvas) {
    this.canvas = canvas;
  }

  postMessage = (message) => {
    return this.canvas.postMessage(message);
  };
}
