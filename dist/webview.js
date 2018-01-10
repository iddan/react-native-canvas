var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WEBVIEW_TARGET = '@@WEBVIEW_TARGET';

var ID = function ID() {
  return Math.random().toString(32).slice(2);
};

var flattenObject = function flattenObject(object) {
  if (typeof object !== 'object') {
    return object;
  }
  var flatObject = {};
  for (var key in object) {
    flatObject[key] = object[key];
  }
  for (var _key in Object.getOwnPropertyNames(object)) {
    flatObject[_key] = object[_key];
  }
  return flatObject;
};

var AutoScaledCanvas = function () {
  function AutoScaledCanvas(element) {
    _classCallCheck(this, AutoScaledCanvas);

    this.element = element;
  }

  _createClass(AutoScaledCanvas, [{
    key: 'toDataURL',
    value: function toDataURL() {
      var _element;

      return (_element = this.element).toDataURL.apply(_element, arguments);
    }
  }, {
    key: 'autoScale',
    value: function autoScale() {
      window.autoScaleCanvas(this.element);
    }
  }, {
    key: 'width',
    get: function get() {
      return this.element.width;
    },
    set: function set(value) {
      this.element.width = value;
      this.autoScale();
      return value;
    }
  }, {
    key: 'height',
    get: function get() {
      return this.element.height;
    },
    set: function set(value) {
      this.element.height = value;
      this.autoScale();
      return value;
    }
  }]);

  return AutoScaledCanvas;
}();

var toMessage = function toMessage(result) {
  if (result instanceof Blob) {
    return {
      type: 'blob',
      payload: btoa(result),
      meta: {}
    };
  }
  if (result instanceof Object) {
    if (!result[WEBVIEW_TARGET]) {
      var id = ID();
      result[WEBVIEW_TARGET] = id;
      targets[id] = result;
    }
    return {
      type: 'json',
      payload: flattenObject(result),
      meta: {
        target: result[WEBVIEW_TARGET],
        constructor: result.constructor.name
      }
    };
  }
  return {
    type: 'json',
    payload: JSON.stringify(result),
    meta: {}
  };
};

var canvas = document.createElement('canvas');
var autoScaledCanvas = new AutoScaledCanvas(canvas);

var targets = {
  canvas: autoScaledCanvas,
  context2D: canvas.getContext('2d')
};

var constructors = {
  Image: Image,
  Path2D: Path2D
};

var populateRefs = function populateRefs(arg) {
  if (arg && arg.__ref__) {
    return targets[arg.__ref__];
  }
  return arg;
};

document.body.appendChild(canvas);

function handleMessage(_ref) {
  var id = _ref.id,
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case 'exec':
      {
        var _targets$target;

        var target = payload.target,
            method = payload.method,
            args = payload.args;

        var result = (_targets$target = targets[target])[method].apply(_targets$target, _toConsumableArray(args.map(populateRefs)));
        var message = toMessage(result);
        postMessage(JSON.stringify(_extends({ id: id }, message)));
        break;
      }
    case 'set':
      {
        var _target = payload.target,
            key = payload.key,
            value = payload.value;

        targets[_target][key] = populateRefs(value);
        break;
      }
    case 'construct':
      {
        var _constructor = payload.constructor,
            _target2 = payload.id,
            _payload$args = payload.args,
            _args = _payload$args === undefined ? [] : _payload$args;

        var object = new (Function.prototype.bind.apply(constructors[_constructor], [null].concat(_toConsumableArray(_args))))();
        var _message = toMessage({});
        targets[_target2] = object;
        postMessage(JSON.stringify(_extends({ id: id }, _message)));
        break;
      }
    case 'listen':
      {
        var _ret = function () {
          var types = payload.types,
              target = payload.target;

          for (var _iterator = types, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
            var _ref2;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref2 = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref2 = _i.value;
            }

            var eventType = _ref2;

            targets[target].addEventListener(eventType, function (e) {
              var message = toMessage({
                type: 'event',
                payload: {
                  type: e.type,
                  target: _extends({}, flattenObject(targets[target]), _defineProperty({}, WEBVIEW_TARGET, target))
                }
              });
              postMessage(JSON.stringify(_extends({ id: id }, message)));
            });
          }
          return 'break';
        }();

        if (_ret === 'break') break;
      }
  }
}

var handleError = function handleError(err, message) {
  postMessage(JSON.stringify({
    id: message.id,
    type: 'error',
    payload: {
      message: err.message
    }
  }));
  document.removeEventListener('message', handleIncomingMessage);
};

function handleIncomingMessage(e) {
  var data = JSON.parse(e.data);
  if (Array.isArray(data)) {
    for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var message = _ref3;

      try {
        handleMessage(message);
      } catch (err) {
        handleError(err, message);
      }
    }
  } else {
    try {
      handleMessage(data);
    } catch (err) {
      handleError(err, data);
    }
  }
}

document.addEventListener('message', handleIncomingMessage);