'use strict';

hexo.extend.helper.register('asset', function (assetPath) {
  const path = require('path');

  const hashedAssets = hexo.locals.get('hashedAssets');
  if (hashedAssets) {
    const hashedAsset = hashedAssets.find(a => a.original === assetPath);
    if (hashedAsset) {
      assetPath = hashedAsset.hashed;
    }
  }

  const ext = path.extname(assetPath);

  return ext === '.js' ?
    `<script type="text/javascript" src="${assetPath}"></script>` :
    `<link rel="stylesheet" href="${assetPath}" async />`;
});
