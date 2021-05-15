'use strict';

module.exports = {
  each(collection, cb) {
    Object.keys(collection).forEach(key => cb(collection[key], key));
    return this;
  },

  mapCall(map, cb, context) {
    this.each(map, (value, key) =>
      cb.call(context, ...(Array.isArray(map) ? [value] : [key, value]))
    );
    return this;
  },
};
