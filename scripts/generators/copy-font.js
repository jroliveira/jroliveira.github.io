'use strict';

hexo.extend.generator.register('copy_font', function () {
  const fs = require('hexo-fs');
  const path = require('path');
  const glob = require('glob');

  const fonts = [{
    source: 'node_modules/@fortawesome/fontawesome-free/webfonts/*.*',
    dest: source => `assets/webfonts/${path.basename(source)}`,
  }, {
    source: 'node_modules/xwing-miniatures-font/dist/*.ttf',
    dest: source => `assets/styles/${path.basename(source)}`,
  }];

  return fonts
    .flatMap(font => glob
      .sync(font.source, { nocase: false })
      .map(source => ({
        path: font.dest(source),
        data: () => fs.createReadStream(source),
      })));
});
