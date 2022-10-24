'use strict';

hexo.extend.filter.register('after_generate', function () {
  const glob = require('glob');
  const path = require('path');

  const patterns = [
    'themes/custom/source/assets/styles/!(main.styl)',
    'themes/custom/source/assets/styles/*/*.styl',
  ];

  patterns
    .flatMap(pattern => glob
      .sync(pattern, { nocase: false })
      .map(filePath => {
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const file = path.basename(filePath, ext);
        const newFilePath = `${dir}/${file}.css`;

        const endpoint = newFilePath.substring(newFilePath.indexOf('assets'), newFilePath.length);

        hexo.route.remove(endpoint);
      }));
});
