'use strict';

Object.defineProperty(Object.prototype, 'years', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {
    return [...new Set(this.map(post => post.date.year()))].sortByYear();
  },
});
