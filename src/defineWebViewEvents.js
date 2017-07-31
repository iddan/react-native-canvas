const defineWebViewEvents = types => target => {
  const {constructor} = target.prototype;
  target.prototype.constructor = function(...args) {
    constructor.apply(this, args);
    this.postMessage({
      type: 'listen',
      payload: {
        types,
      },
    });
    this.handleMessage(message => {
      if (message.type === 'event' && types.includes(message.payload.type)) {
        this.dispatchEvent({
          ...message.payload,
          target: this,
        });
      }
    });
  };
  target.prototype.listeners = {};
  target.prototype.addEventListener = function(type, callback) {
    const listeners = (this.listeners[type] = this.listeners[type] || []);
    listeners.push(callback);
  };
  target.prototype.dispatchEvent = function(event) {
    const listeners = this.listeners[event.type];
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
      listener(event);
    }
  };
};

export default defineWebViewEvents;
