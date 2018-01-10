Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _class;

var _Canvas = require('./Canvas');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _webviewBinders = require('./webview-binders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Image = (_dec = (0, _webviewBinders.webviewProperties)({ crossOrigin: undefined, height: undefined, src: undefined, width: undefined }), _dec2 = (0, _webviewBinders.webviewEvents)(['load', 'error']), _dec3 = (0, _webviewBinders.webviewConstructor)('Image'), _dec(_class = _dec2(_class = _dec3(_class = function Image(canvas, width, height) {
  var _this = this;

  _classCallCheck(this, Image);

  this.postMessage = function (message) {
    return _this.canvas.postMessage(message);
  };

  this.addMessageListener = function (listener) {
    return _this.canvas.addMessageListener(listener);
  };

  if (!(canvas instanceof _Canvas2.default)) {
    throw new Error('Image must be initialized with a Canvas instance');
  }
  this.canvas = canvas;
  if (this.onConstruction) {
    this.onConstruction();
  }
  if (this.width) {
    this.width = width;
  }
  if (this.height) {
    this.height = height;
  }
}) || _class) || _class) || _class);
exports.default = Image;