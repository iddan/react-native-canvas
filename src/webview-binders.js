import mapValues from 'lodash/mapValues';

const WEBVIEW_TARGET = Symbol('webviewTarget');

export const webviewTarget = targetName => target => {
  target.prototype[webviewTarget] = targetName;
};

export const webviewConstructor = constructorName => target => {
  const {onConstruction} = target.prototype;
  target.prototype.onConstruction = function() {
    if (onConstruction) {
      onConstruction();
    }
    this.postMessage({
      type: 'construct',
      payload: {
        constructor: constructorName,
      },
    }).then(({result}) => {
      this[WEBVIEW_TARGET] = result;
    });
  };
  target.prototype.toJSON = function() {
    return {__ref__: this[WEBVIEW_TARGET]};
  };
};

export const webviewMethods = methods => target => {
  for (const method of methods) {
    target.prototype[method] = function(...args) {
      return this.postMessage({
        type: 'exec',
        payload: {
          target: this[WEBVIEW_TARGET],
          method,
          args,
        },
      });
    };
  }
};

export const webviewProperties = properties => target => {
  Object.defineProperties(
    target.prototype,
    mapValues(properties, (initialValue, key) => {
      const privateKey = `__${key}__`;
      target.prototype[privateKey] = initialValue;
      return {
        get() {
          return this[privateKey];
        },
        set(value) {
          this.postMessage({
            type: 'set',
            payload: {
              target: this[WEBVIEW_TARGET],
              key,
              value,
            },
          });

          if (this.forceUpdate) {
            this.forceUpdate();
          }

          return (this[privateKey] = value);
        },
      };
    }),
  );
};

export const webviewEvents = types => target => {
  const {onConstruction} = target.prototype;
  target.prototype.onConstruction = function() {
    if (onConstruction) {
      onConstruction();
    }
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
