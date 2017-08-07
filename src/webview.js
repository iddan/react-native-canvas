const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const targets = {
  canvas,
  context2D: canvas.getContext('2d'),
};

const constructors = {
  Image,
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
    payload: JSON.stringify(result),
  };
};

document.addEventListener('message', e => {
  const {type, payload} = JSON.parse(e.data);
  try {
    switch (type) {
      case 'exec': {
        const {target, method, args} = payload;
        const result = targets[target][method](...args);
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
        postMessage(JSON.stringify(toMessage({})));
      }
    }
  } catch (err) {
    document.body.innerHTML = `<div class="error">${err}</div>`;
  }
});
