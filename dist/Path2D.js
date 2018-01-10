Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _class;

var _webviewBinders = require('./webview-binders');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path2D = (_dec = (0, _webviewBinders.webviewMethods)(['addPath', 'closePath', 'moveTo', 'lineTo', 'bezierCurveTo', 'quadraticCurveTo', 'arc', 'arcTo', 'ellipse', 'rect']), _dec2 = (0, _webviewBinders.webviewConstructor)('Path2D'), _dec(_class = _dec2(_class = function Path2D(canvas) {
  var _this = this;

  _classCallCheck(this, Path2D);

  this.postMessage = function (message) {
    return _this.canvas.postMessage(message);
  };

  this.addMessageListener = function (listener) {
    return _this.canvas.addMessageListener(listener);
  };

  this.canvas = canvas;
  if (this.onConstruction) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.onConstruction.apply(this, args);
  }
}) || _class) || _class);
exports.default = Path2D;