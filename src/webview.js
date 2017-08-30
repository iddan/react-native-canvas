const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const targets = {
  canvas,
  context2D: canvas.getContext('2d'),
};

const constructors = {
  Image,
  Path2D,
};

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

const populateRefs = arg => {
  if (arg.__ref__) {
    return targets[arg.__ref__];
  }
  return arg;
};

document.addEventListener('message', e => {
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
              },
            });
            postMessage(JSON.stringify({id, ...message}));
          });
        }
        break;
      }
    }
  } catch (err) {
    document.body.innerHTML = `<div class="error">${err}</div>`;
  }
});
