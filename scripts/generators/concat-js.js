'use strict';

hexo.extend.generator.register('concat_js', function () {
  const fs = require('hexo-fs');
  const glob = require('glob');
  const md5 = require('md5');
  const UglifyJS = require('uglify-js');

  const scripts = [
    'node_modules/jquery/dist/jquery.min.js',
    'themes/custom/source/assets/scripts/*.js',
    'themes/custom/source/assets/scripts/*/*.js',
  ];

  const newContent = scripts
    .flatMap(pattern => glob
      .sync(pattern, { nocase: false })
      .map(filePath => {
        const content = fs.readFileSync(filePath);
        return filePath.includes('.min.') ? content : UglifyJS.minify(content).code;
      }))
    .reduce((txt, script) => (txt += script), '');

  const hash = md5(newContent).substring(0, 6);
  const newFilePath = `/assets/scripts/main.${hash}.js`;

  const hashedAssets = hexo.locals.get('hashedAssets') ?? [];
  hashedAssets.push({
    original: '/assets/scripts/main.js',
    hashed: newFilePath,
  });

  hexo.locals.set('hashedAssets', () => hashedAssets);

  return {
    path: newFilePath,
    data: newContent,
  };
});
