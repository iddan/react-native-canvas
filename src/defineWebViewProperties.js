import mapValues from 'lodash/mapValues';

const defineWebViewProperties = (targetName, properties) => target => {
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
              target: targetName,
              key,
              value,
            },
          });
          return (this[privateKey] = value);
        },
      };
    }),
  );
};

export default defineWebViewProperties;
