Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var WEBVIEW_TARGET = exports.WEBVIEW_TARGET = '@@WEBVIEW_TARGET';

var constructors = exports.constructors = {};

var webviewTarget = exports.webviewTarget = function webviewTarget(targetName) {
  return function (target) {
    target.prototype[WEBVIEW_TARGET] = targetName;
  };
};

var ID = function ID() {
  return Math.random().toString(32).slice(2);
};

var webviewConstructor = exports.webviewConstructor = function webviewConstructor(constructorName) {
  return function (target) {
    var onConstruction = target.prototype.onConstruction;

    constructors[constructorName] = target;

    target.prototype.onConstruction = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (onConstruction) {
        onConstruction.call(this);
      }
      this[WEBVIEW_TARGET] = ID();
      this.postMessage({
        type: 'construct',
        payload: {
          constructor: constructorName,
          id: this[WEBVIEW_TARGET],
          args: args
        }
      });
    };
    target.prototype.toJSON = function () {
      return { __ref__: this[WEBVIEW_TARGET] };
    };
  };
};

var webviewMethods = exports.webviewMethods = function webviewMethods(methods) {
  return function (target) {
    var _loop = function _loop(method) {
      target.prototype[method] = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this.postMessage({
          type: 'exec',
          payload: {
            target: this[WEBVIEW_TARGET],
            method: method,
            args: args
          }
        });
      };
    };

    for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var method = _ref;

      _loop(method);
    }
  };
};

var webviewProperties = exports.webviewProperties = function webviewProperties(properties) {
  return function (target) {
    var _loop2 = function _loop2(key) {
      var initialValue = properties[key];
      var privateKey = '__' + key + '__';
      target.prototype[privateKey] = initialValue;
      Object.defineProperty(target.prototype, key, {
        get: function get() {
          return this[privateKey];
        },
        set: function set(value) {
          this.postMessage({
            type: 'set',
            payload: {
              target: this[WEBVIEW_TARGET],
              key: key,
              value: value
            }
          });

          if (this.forceUpdate) {
            this.forceUpdate();
          }

          return this[privateKey] = value;
        }
      });
    };

    for (var _iterator2 = Object.keys(properties), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var key = _ref2;

      _loop2(key);
    }
  };
};

var webviewEvents = exports.webviewEvents = function webviewEvents(types) {
  return function (target) {
    var onConstruction = target.prototype.onConstruction;

    target.prototype.onConstruction = function () {
      if (onConstruction) {
        onConstruction.call(this);
      }
      this.postMessage({
        type: 'listen',
        payload: {
          types: types,
          target: this[WEBVIEW_TARGET]
        }
      });
    };
    target.prototype.addEventListener = function (type, callback) {
      var _this = this;

      this.addMessageListener(function (message) {
        if (message && message.type === 'event' && message.payload.target[WEBVIEW_TARGET] === _this[WEBVIEW_TARGET] && message.payload.type === type) {
          for (var key in message.payload.target) {
            var value = message.payload.target[key];
            if (key in _this && _this[key] !== value) {
              _this[key] = value;
            }
          }
          callback(_extends({}, message.payload, {
            target: _this
          }));
        }
      });
    };
  };
};