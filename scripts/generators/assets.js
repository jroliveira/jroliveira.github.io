'use strict';

hexo.extend.generator.register('assets', function (locals) {
  const fs = require('hexo-fs');
  const path = require('path');
  const glob = require('glob');
  const md5 = require('md5');

  const assets = [
    {
      source: 'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
      dest: () => 'assets/styles/fontawesome.css',
    },
    {
      source: 'node_modules/@fortawesome/fontawesome-free/webfonts/*.*',
      dest: source => `assets/webfonts/${path.basename(source)}`,
      noHash: true,
    }
  ];

  const hashedAssets = [];

  const allAssets = assets.flatMap(asset => glob
    .sync(asset.source, {
      nocase: false,
    })
    .map(source => {
      let dest = asset.dest(source);

      if (!asset.noHash && ['.css', '.js'].includes(path.extname(dest))) {
        const original = dest;

        const hash = md5(fs.readFileSync(source)).substring(0, 6);
        const file = path.basename(dest, path.extname(dest));
        const hashedFile = `${file}.${hash}${path.extname(dest)}`;

        dest = `${path.dirname(dest)}/${hashedFile}`;

        hashedAssets.push({
          path: original,
          hashedPath: dest,
        });
      }

      return {
        path: dest,
        data: () => fs.createReadStream(source),
      }
    }));

  hexo.locals.set('hashedAssets', () => hashedAssets);

  return allAssets;
});
