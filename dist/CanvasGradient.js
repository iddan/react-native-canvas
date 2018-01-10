Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _class;

var _webviewBinders = require('./webview-binders');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasGradient = (_dec = (0, _webviewBinders.webviewMethods)(['addColorStop']), _dec2 = (0, _webviewBinders.webviewConstructor)('CanvasGradient'), _dec(_class = _dec2(_class = function CanvasGradient(canvas) {
  var _this = this;

  _classCallCheck(this, CanvasGradient);

  this.postMessage = function (message) {
    return _this.canvas.postMessage(message);
  };

  this.canvas = canvas;
}) || _class) || _class);
exports.default = CanvasGradient;