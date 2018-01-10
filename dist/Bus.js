Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bus = function () {
  function Bus(send) {
    _classCallCheck(this, Bus);

    this._paused = false;
    this._messageListeners = {};
    this._queue = [];

    this._send = send;
  }

  _createClass(Bus, [{
    key: "post",
    value: function post(message) {
      var _this = this;

      return new Promise(function (resolve) {
        _this._messageListeners[message.id] = resolve;
        if (!_this._paused) {
          _this._send(message);
        } else {
          _this._queue.push(message);
        }
      });
    }
  }, {
    key: "handle",
    value: function handle(message) {
      this._messageListeners[message.id](message);
    }
  }, {
    key: "pause",
    value: function pause() {
      this._paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      this._paused = false;
      this._send(this._queue);
      this._queue = [];
    }
  }]);

  return Bus;
}();

exports.default = Bus;