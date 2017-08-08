const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const ID = () => Math.random().toString(32).slice(2);

const targets = {
  canvas,
  context2D: canvas.getContext('2d'),
};

const constructors = {
  Image,
  CanvasGradient,
  CanvasPattern,
};

const toMessage = result => {
  if (result instanceof Blob) {
    return {
      type: 'blob',
      payload: btoa(result),
    };
  }
  if (result && constructors[result.constructor.name]) {
    const id = ID();
    targets[id] = result;
    return {
      type: 'ref',
      payload: {
        id,
        constructor: result.constructor.name,
      },
    };
  }
  return {
    type: 'json',
    payload: result,
  };
};

const handleEvent = e => {
  postMessage(
    JSON.stringify(
      toMessage({
        type: 'event',
        payload: {
          type: e.type,
        },
      }),
    ),
  );
};

document.addEventListener('message', e => {
  const {type, payload} = JSON.parse(e.data);
  try {
    switch (type) {
      case 'exec': {
        const {target, method, args} = payload;
        const result = targets[target][method](
          ...args.map(arg => {
            if (arg.__ref__) {
              return targets[arg.__ref__];
            }
            return arg;
          }),
        );
        const message = toMessage(result);
        postMessage(JSON.stringify(message));
        break;
      }
      case 'set': {
        const {target, key, value} = payload;
        targets[target][key] = value;
        break;
      }
      case 'construct': {
        const {constructor, id, args = []} = payload;
        const object = new constructors[constructor](...args);
        targets[id] = object;
        postMessage(JSON.stringify(toMessage(null)));
        break;
      }
      case 'listen': {
        const {types, target} = payload;
        for (const eventType of types) {
          targets[target].addEventListener(eventType, handleEvent);
        }
        break;
      }
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error">${err}</div>`;
  }
});
