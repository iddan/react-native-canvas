const WEBVIEW_TARGET = '@@WEBVIEW_TARGET';

export const webviewTarget = targetName => target => {
  target.prototype[WEBVIEW_TARGET] = targetName;
};

const ID = () => Math.random().toString(32).slice(2);

export const webviewConstructor = constructorName => target => {
  const {onConstruction} = target.prototype;
  target.prototype.onConstruction = function() {
    if (onConstruction) {
      onConstruction.call(this);
    }
    this[WEBVIEW_TARGET] = ID();
    this.postMessage({
      type: 'construct',
      payload: {
        constructor: constructorName,
        id: this[WEBVIEW_TARGET],
      },
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
  for (const key of Object.keys(properties)) {
    const initialValue = properties[key];
    const privateKey = `__${key}__`;
    target.prototype[privateKey] = initialValue;
    Object.defineProperty(target.prototype, key, {
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
    });
  }
};

export const webviewEvents = types => target => {
  const {onConstruction} = target.prototype;
  target.prototype.onConstruction = function() {
    if (onConstruction) {
      onConstruction.call(this);
    }
    this.postMessage({
      type: 'listen',
      payload: {
        types,
        target: this[WEBVIEW_TARGET],
      },
    });
  };
  target.prototype.addEventListener = function(type, callback) {
    this.addMessageListener((id, message) => {
      if (message && message.type === 'event' && message.payload.type === type) {
        callback({
          ...message.payload,
          target: this,
        });
      }
    });
  };
};
