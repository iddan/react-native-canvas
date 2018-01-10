Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Path2D = exports.Image = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec,
    _dec2,
    _dec3,
    _class,
    _class2,
    _temp,
    _jsxFileName = 'src/Canvas.js';

var _Image = require('./Image');

Object.defineProperty(exports, 'Image', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Image).default;
  }
});

var _Path2D = require('./Path2D');

Object.defineProperty(exports, 'Path2D', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Path2D).default;
  }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

var _Bus = require('./Bus');

var _Bus2 = _interopRequireDefault(_Bus);

var _webviewBinders = require('./webview-binders');

var _CanvasRenderingContext2D = require('./CanvasRenderingContext2D');

var _CanvasRenderingContext2D2 = _interopRequireDefault(_CanvasRenderingContext2D);

var _indexHtml = require('./index.html.js');

var _indexHtml2 = _interopRequireDefault(_indexHtml);

require('./CanvasGradient');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var regeneratorRuntime = require('regenerator-runtime');

var Canvas = (_dec = (0, _webviewBinders.webviewTarget)('canvas'), _dec2 = (0, _webviewBinders.webviewProperties)({ width: 300, height: 150 }), _dec3 = (0, _webviewBinders.webviewMethods)(['toDataURL']), _dec(_class = _dec2(_class = _dec3(_class = (_temp = _class2 = function (_Component) {
  _inherits(Canvas, _Component);

  function Canvas() {
    var _this2 = this;

    _classCallCheck(this, Canvas);

    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

    _this.addMessageListener = function (listener) {
      _this.listeners.push(listener);
      return function () {
        return _this.removeMessageListener(listener);
      };
    };

    _this.removeMessageListener = function (listener) {
      _this.listeners.splice(_this.listeners.indexOf(listener), 1);
    };

    _this.loaded = false;

    _this.webviewPostMessage = function (message) {
      return _this.webview && _this.webview.postMessage(JSON.stringify(message));
    };

    _this.bus = new _Bus2.default(_this.webviewPostMessage);
    _this.listeners = [];
    _this.context2D = new _CanvasRenderingContext2D2.default(_this);

    _this.getContext = function (contextType, contextAttributes) {
      switch (contextType) {
        case '2d':
          {
            return _this.context2D;
          }
      }
      return null;
    };

    _this.postMessage = function _callee(message) {
      var _ref, stack, _ref2, type, payload, error;

      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _ref = new Error(), stack = _ref.stack;
              _context.next = 3;
              return regeneratorRuntime.awrap(_this.bus.post(_extends({ id: Math.random() }, message)));

            case 3:
              _ref2 = _context.sent;
              type = _ref2.type;
              payload = _ref2.payload;
              _context.t0 = type;
              _context.next = _context.t0 === 'error' ? 9 : _context.t0 === 'json' ? 12 : _context.t0 === 'blob' ? 13 : 14;
              break;

            case 9:
              error = new Error(payload.message);

              error.stack = stack;
              throw error;

            case 12:
              return _context.abrupt('return', payload);

            case 13:
              return _context.abrupt('return', atob(payload));

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, null, _this2);
    };

    _this.handleMessage = function (e) {
      var data = JSON.parse(e.nativeEvent.data);
      switch (data.type) {
        case 'log':
          {
            var _console;

            (_console = console).log.apply(_console, _toConsumableArray(data.payload));
            break;
          }
        default:
          {
            if (data.payload) {
              var _constructor = _webviewBinders.constructors[data.meta.constructor];
              if (_constructor) {
                var _data = data,
                    payload = _data.payload;

                data = _extends({}, data, {
                  payload: _extends(new _constructor(_this), payload, _defineProperty({}, _webviewBinders.WEBVIEW_TARGET, data.meta.target))
                });
              }
              for (var _iterator = _this.listeners, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? typeof Symbol === 'function' ? Symbol.iterator : '@@iterator' : '@@iterator']();;) {
                var _ref3;

                if (_isArray) {
                  if (_i >= _iterator.length) break;
                  _ref3 = _iterator[_i++];
                } else {
                  _i = _iterator.next();
                  if (_i.done) break;
                  _ref3 = _i.value;
                }

                var listener = _ref3;

                listener(data.payload);
              }
            }
            _this.bus.handle(data);
          }
      }
    };

    _this.handleRef = function (element) {
      _this.webview = element;
    };

    _this.handleLoad = function () {
      _this.loaded = true;
      _this.bus.resume();
    };

    _this.bus.pause();
    return _this;
  }

  _createClass(Canvas, [{
    key: 'render',
    value: function render() {
      var width = this.width,
          height = this.height;
      var style = this.props.style;

      if (_reactNative.Platform.OS === 'android') {
        return _react2.default.createElement(
          _reactNative.View,
          { style: _extends({ width: width, height: height, overflow: 'hidden', flex: 0 }, style), __source: {
              fileName: _jsxFileName,
              lineNumber: 111
            }
          },
          _react2.default.createElement(_reactNative.WebView, {
            ref: this.handleRef,
            style: { width: width, height: height, overflow: 'hidden', backgroundColor: 'transparent' },
            source: { html: _indexHtml2.default },
            onMessage: this.handleMessage,
            onLoad: this.handleLoad,
            mixedContentMode: 'always',
            scalesPageToFit: false,
            javaScriptEnabled: true,
            domStorageEnabled: true,
            thirdPartyCookiesEnabled: true,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 112
            }
          })
        );
      }
      return _react2.default.createElement(
        _reactNative.View,
        { style: _extends({ width: width, height: height, overflow: 'hidden', flex: 0 }, style), __source: {
            fileName: _jsxFileName,
            lineNumber: 128
          }
        },
        _react2.default.createElement(_reactNative.WebView, {
          ref: this.handleRef,
          style: { width: width, height: height, overflow: 'hidden', backgroundColor: 'transparent' },
          source: { html: _indexHtml2.default, baseUrl: '/' },
          onMessage: this.handleMessage,
          onLoad: this.handleLoad,
          scrollEnabled: false,
          scalesPageToFit: false,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 129
          }
        })
      );
    }
  }]);

  return Canvas;
}(_react.Component), _class2.propTypes = {
  style: _propTypes2.default.shape(_reactNative.ViewStylePropTypes)
}, _temp)) || _class) || _class) || _class);
exports.default = Canvas;