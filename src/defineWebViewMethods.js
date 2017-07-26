const defineWebViewMethods = (targetName, methods) => target => {
  for (const method of methods) {
    target.prototype[method] = function(...args) {
      return this.postMessage({
        type: 'exec',
        payload: {
          target: targetName,
          method,
          args,
        },
      });
    };
  }
};

export default defineWebViewMethods;
