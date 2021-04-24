'use strict';

Object.defineProperty(Object.prototype, 'filterByDate', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (date) {
    return this.filter(post => post.date.format() == date.format());
  },
});

Object.defineProperty(Object.prototype, 'filterByLang', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (lang) {
    return this
      .filter(post => post.lang == lang)
      .withCategories(['dev'])
      .sortByDate();
  },
});

Object.defineProperty(Object.prototype, 'filterByTag', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (tag) {
    return this
      .filter(post => post.tags.map(item => item.name).includes(tag.name))
      .withCategories(['dev'])
      .groupByDate()
      .sortByDate();
  },
});

Object.defineProperty(Object.prototype, 'withCategories', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: function (categories) {
    return this.filter(post => post
      .categories
      .some(category => categories
        .indexOf(category.name) !== -1));
  },
});
