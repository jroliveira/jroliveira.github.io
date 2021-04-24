'use strict';

Object.defineProperty(Object.prototype, 'groupByDate', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function () {
    return this
      .filter((post, pos) => this
        .map(item => item.date.format())
        .indexOf(post.date.format()) == pos)
      .sortByDate();
  },
});
