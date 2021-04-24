'use strict';

Object.defineProperty(Object.prototype, 'available', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {
    return this
      .filter(tag => !['poem', 'drawing'].includes(tag.name))
      .sort('name');
  },
});
