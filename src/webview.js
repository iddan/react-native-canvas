const flattenObject = object => {
  if (typeof object !== 'object') {
    return object;
  }
  const flatObject = {};
  for (const key in object) {
    flatObject[key] = object[key];
  }
  for (const key in Object.getOwnPropertyNames(object)) {
    flatObject[key] = object[key];
  }
  return flatObject;
};

class AutoScaledCanvas {
  constructor(element) {
    this.element = element;
  }

  toDataURL(...args) {
    return this.element.toDataURL(...args);
  }

  autoScale() {
    window.autoScaleCanvas(this.element);
  }

  get width() {
    return this.element.width;
  }

  set width(value) {
    this.element.width = value;
    this.autoScale();
    return value;
  }

  get height() {
    return this.element.height;
  }

  set height(value) {
    this.element.height = value;
    this.autoScale();
    return value;
  }
}

const toMessage = result => {
  if (result instanceof Blob) {
    return {
      type: 'blob',
      payload: btoa(result),
    };
  }
  return {
    type: 'json',
    payload: flattenObject(result),
  };
};

const canvas = document.createElement('canvas');
const autoScaledCanvas = new AutoScaledCanvas(canvas);

const targets = {
  canvas: autoScaledCanvas,
  context2D: canvas.getContext('2d'),
};

const constructors = {
  Image,
  Path2D,
};

const populateRefs = arg => {
  if (arg && arg.__ref__) {
    return targets[arg.__ref__];
  }
  return arg;
};

document.body.appendChild(canvas);

function handleMessage(e) {
  const {id, type, payload} = JSON.parse(e.data);
  try {
    switch (type) {
      case 'exec': {
        const {target, method, args} = payload;
        const result = targets[target][method](...args.map(populateRefs));
        const message = toMessage(result);
        postMessage(JSON.stringify({id, ...message}));
        break;
      }
      case 'set': {
        const {target, key, value} = payload;
        targets[target][key] = value;
        break;
      }
      case 'construct': {
        const {constructor, id: target, args = []} = payload;
        const object = new constructors[constructor](...args);
        const message = toMessage({});
        targets[target] = object;
        postMessage(JSON.stringify({id, ...message}));
        break;
      }
      case 'listen': {
        const {types, target} = payload;
        for (const eventType of types) {
          targets[target].addEventListener(eventType, e => {
            const message = toMessage({
              type: 'event',
              payload: {
                type: e.type,
                target: {...flattenObject(targets[target]), '@@WEBVIEW_TARGET': target},
              },
            });
            postMessage(JSON.stringify({id, ...message}));
          });
        }
        break;
      }
    }
  } catch (err) {
    postMessage(
      JSON.stringify({
        id,
        type: 'error',
        payload: {
          message: err.message,
        },
      }),
    );
    document.removeEventListener('message', handleMessage);
  }
}

document.addEventListener('message', handleMessage);
