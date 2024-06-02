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
    return new Promise((resolve) => {
      /**
       * Currently, 'set' is the only message type that's not resolved
       * back to the caller. If we store it here, it will leak memory
       * because the entry won't get removed from this._messageListeners.
       */
      if (message.type !== "set") {
        this._messageListeners[message.id] = resolve;
      }

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
    const handler = this._messageListeners[message.id];

    // Delete the message listener from the cache as soon as it's handled.
    delete this._messageListeners[message.id];

    if (handler) {
      handler(message);
    } else {
      console.warn("Received unexpected message", message);
    }
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
