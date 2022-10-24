'use strict';

hexo.extend.filter.register('after_generate', function () {
  const glob = require('glob');

  const patterns = [
    'themes/custom/source/assets/scripts/*.js',
    'themes/custom/source/assets/scripts/*/*.js',
  ];

  patterns
    .flatMap(pattern => glob
      .sync(pattern, { nocase: false })
      .map(filePath => {
        const endpoint = filePath.substring(filePath.indexOf('assets'), filePath.length);
        hexo.route.remove(endpoint);
      }));
});
