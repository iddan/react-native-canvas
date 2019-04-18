const WEBVIEW_TARGET = '@@WEBVIEW_TARGET';

const ID = () =>
  Math.random()
    .toString(32)
    .slice(2);

const flattenObjectCopyValue = (flatObj, srcObj, key) => {
  const value = srcObj[key];
  if (typeof value === 'function') {
    return;
  }
  if (typeof value === 'object' && value instanceof Node) {
    return;
  }
  flatObj[key] = flattenObject(value);
}

const flattenObject = object => {
  if (typeof object !== 'object' || object === null) {
    return object;
  }
  const flatObject = {};
  for (const key in object) {
    flattenObjectCopyValue(flatObject, object, key);
  }
  for (const key in Object.getOwnPropertyNames(object)) {
    flattenObjectCopyValue(flatObject, object, key);
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
    if (this.savedHeight !== undefined) {
      this.element.height = this.savedHeight;
    }
    if (this.savedWidth !== undefined) {
      this.element.width = this.savedWidth;
    }
    window.autoScaleCanvas(this.element);
  }

  get width() {
    return this.element.width;
  }

  set width(value) {
    this.savedWidth = value;
    this.autoScale();
    return value;
  }

  get height() {
    return this.element.height;
  }

  set height(value) {
    this.savedHeight = value;
    this.autoScale();
    return value;
  }

  initFonts(fonts = []) {
    return Promise
      .all(fonts.map(font => this.addFont(font)));
  }

  addFont(font) {
    const {
      name,
      link,
      options: {
        style = 'normal',
        weight = 500,
      } = {},
    } = font;
    return new Promise(resolve => {
      const fontFace = new FontFace(name, `url(${link})`, {style, weight});
      document.fonts.onloadingdone = resolve;
      document.fonts.add(fontFace);
    });
  }
}

const toMessage = result => {
  if (result instanceof Blob) {
    return {
      type: 'blob',
      payload: btoa(result),
      meta: {},
    };
  }
  if (result instanceof Object) {
    if (!result[WEBVIEW_TARGET]) {
      const id = ID();
      result[WEBVIEW_TARGET] = id;
      targets[id] = result;
    }
    return {
      type: 'json',
      payload: flattenObject(result),
      args: toArgs(flattenObject(result)),
      meta: {
        target: result[WEBVIEW_TARGET],
        constructor: result.__constructorName__ || result.constructor.name,
      },
    };
  }
  return {
    type: 'json',
    payload: JSON.stringify(result),
    meta: {},
  };
};

/**
 * Gets the all the args required for creating the object.
 * Also converts typed arrays to normal arrays.
 *
 * For example with ImageData we need a Uint8ClampedArray,
 * but if we sent it as JSON it will be sent as an object
 * not an array. So we convert any typed arrays into arrays
 * first, they will be converted to Uint8ClampedArrays in
 * `webview-binders.js`.
 *
 */
const toArgs = result => {
  const args = [];
  for (const key in result) {
    if (result[key] !== undefined && key !== '@@WEBVIEW_TARGET') {
      if (typedArrays[result[key].constructor.name] !== undefined) {
        result[key] = Array.from(result[key]);
      }
      args.push(result[key]);
    }
  }
  return args;
};

/**
 * Creates objects from args. If any argument have the object
 * which contains `className` it means we need to convert that
 * argument into an object.
 *
 * We need to do this because when we pass data between the WebView
 * and RN using JSON, it strips/removes the class data from the object.
 * So this will raise errors as the WebView will expect arguments to be
 * of a certain class.
 *
 * For example for ImageData we expect to receive
 * [{className: Uint8ClampedArray, classArgs: [Array(4)]}, 100, 100]
 * We need to convert the first parameter into an object first.
 *
 */
const createObjectsFromArgs = args => {
  for (let index = 0; index < args.length; index += 1) {
    const currentArg = args[index];
    if (currentArg.className !== undefined) {
      const {className, classArgs} = currentArg;
      const constructor = new constructors[className](...classArgs);
      args[index] = constructor;
    }
  }
  return args;
};

const print = (...args) => {
  const message = JSON.stringify({
    type: 'log',
    payload: args,
  });
  window.ReactNativeWebView.postMessage(message);
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
  CanvasGradient,
  ImageData,
  Uint8ClampedArray,
};

const typedArrays = {
  Uint8ClampedArray,
};

/**
 * In iOS 9 constructors doesn't have bind defined which fails
 * Babel object constructors utility function
 */
Image.bind =
  Image.bind ||
  function() {
    return Image;
  };

Path2D.bind =
  Path2D.bind ||
  function() {
    return Path2D;
  };

ImageData.bind =
  ImageData.bind ||
  function() {
    return ImageData;
  };

Uint8ClampedArray.bind =
  Uint8ClampedArray.bind ||
  function() {
    return Uint8ClampedArray;
  };

const populateRefs = arg => {
  if (arg && arg.__ref__) {
    return targets[arg.__ref__];
  }
  return arg;
};

document.body.appendChild(canvas);

function handleMessage({id, type, payload}) {
  switch (type) {
    case 'exec': {
      const {target, method, args} = payload;
      const result = targets[target][method](...args.map(populateRefs));
      const message = toMessage(result);

      /**
       * In iOS 9 some classes name are not defined so we compare to
       * known constructors to find the name.
       */
      if (typeof result === 'object' && !message.meta.constructor) {
        for (const constructorName in constructors) {
          if (result instanceof constructors[constructorName]) {
            message.meta.constructor = constructorName;
          }
        }
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({id, ...message}));
      break;
    }
    case 'set': {
      const {target, key, value} = payload;
      targets[target][key] = populateRefs(value);
      break;
    }
    case 'construct': {
      const {constructor, id: target, args = []} = payload;
      const newArgs = createObjectsFromArgs(args);
      const object = new constructors[constructor](...newArgs);
      object.__constructorName__ = constructor;
      const message = toMessage({});
      targets[target] = object;
      window.ReactNativeWebView.postMessage(JSON.stringify({id, ...message}));
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
              target: {...flattenObject(targets[target]), [WEBVIEW_TARGET]: target},
            },
          });
          window.ReactNativeWebView.postMessage(JSON.stringify({id, ...message}));
        });
      }
      break;
    }
  }
}

const handleError = (err, message) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      id: message.id,
      type: 'error',
      payload: {
        message: err.message,
      },
    }),
  );
  document.removeEventListener('message', handleIncomingMessage);
};

function handleIncomingMessage(e) {
  const data = JSON.parse(e.data);
  if (Array.isArray(data)) {
    for (const message of data) {
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

// iOS
window.addEventListener('message', handleIncomingMessage);
// Android
document.addEventListener('message', handleIncomingMessage);
