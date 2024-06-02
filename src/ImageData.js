import Canvas from "./Canvas";
import { webviewConstructor } from "./webview-binders";

@webviewConstructor("ImageData")
export default class ImageData {
  constructor(canvas, array, width, height, noOnConstruction) {
    if (!(canvas instanceof Canvas)) {
      throw new Error("ImageData must be initialized with a Canvas instance");
    }
    this.canvas = canvas;
    if (this.onConstruction && !noOnConstruction) {
      this.onConstruction(array, width, height);
    }
  }

  postMessage = (message) => {
    return this.canvas.postMessage(message);
  };

  addMessageListener = (listener) => {
    return this.canvas.addMessageListener(listener);
  };
}
