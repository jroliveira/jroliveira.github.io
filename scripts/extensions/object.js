'use strict';

Object.defineProperty(Object.prototype, 'toPage', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (pageSize) {
    return this.reduce((prev, curr, i) => {
      const idx = Math.floor(i / pageSize);
      const page = prev[idx] || (prev[idx] = []);
      page.push(curr);

      return prev;
    }, []);
  },
});
