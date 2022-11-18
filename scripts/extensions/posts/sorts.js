'use strict';

Object.defineProperty(Object.prototype, 'sortByDate', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {
    return this.sort('-date');
  },
});

Object.defineProperty(Object.prototype, 'sortByYear', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {
    return this.sort((a, b) => b - a);
  },
});
