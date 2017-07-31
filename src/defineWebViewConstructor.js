const defineWebViewConstructor = constructorName => target => {
  const {constructor} = target.prototype;
  target.prototype.constructor = function(...args) {
    constructor.apply(this, args);
    this.postMessage({
      type: 'construct',
      payload: {
        constructor: constructorName,
      },
    }).then(({result}) => {
      this.ref = result;
    });
  };
  target.prototype.toJSON = function() {
    return {__ref__: this.ref};
  };
};

export default defineWebViewConstructor;
