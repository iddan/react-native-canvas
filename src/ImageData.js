import {webviewConstructor, webviewProperties} from './webview-binders';

@webviewProperties({
    data: null,
    height: 100,
    width: 100
})
@webviewConstructor('ImageData')
export default class ImageData {
    constructor(array, width, height, canvas) {
        this.canvas = canvas;

        if (this.onConstruction) {
            this.onConstruction(array, width, height);
        }
    }

    postMessage = message => {
        if (this.canvas)
            return this.canvas.postMessage(message);
    };

    addMessageListener = listener => {
        if (this.canvas)
            return this.canvas.addMessageListener(listener);
    };
}
