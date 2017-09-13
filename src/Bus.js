/**
 * @typedef {Object} Message
 * @property {string} id
 */

export default class Bus {
  _paused = false;
  /**
   * @type {Object.<string, function>}
   */
  _messageListeners = {};
  /**
   * @type {Message[]}
   */
  _queue = [];
  /**
   * @param {function} send 
   */
  constructor(send) {
    this._send = send;
  }
  /**
   * @param {Message} message 
   * @return {Promise.<Message>}
   */
  post(message) {
    return new Promise(resolve => {
      this._messageListeners[message.id] = resolve;
      if (!this._paused) {
        this._send(message);
      } else {
        this._queue.push(message);
      }
    });
  }
  /**
   * @param {Message} message 
   * @return {void}
   */
  handle(message) {
    this._messageListeners[message.id](message);
  }
  /**
   * @returns {void}
   */
  pause() {
    this._paused = true;
  }
  /**
   * @returns {void}
   */
  resume() {
    this._paused = false;
    this._send(this._queue);
    this._queue = [];
  }
}
