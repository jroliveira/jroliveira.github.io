'use strict';

const path = require('path');

hexo.extend.helper.register('asset', function (asset) {
  let assetPath = asset;
  const url_for = hexo.extend.helper.get('url_for').bind(hexo);

  const hashedAssets = hexo.locals.get('hashedAssets');

  if (hashedAssets) {
    let hashedAsset = hashedAssets.find(item => item.path === asset);

    if (hashedAsset) {
      assetPath = hashedAsset.hashedPath;
    }
  }

  const ext = path.extname(assetPath);

  return ext === '.js'
    ? `<script type="text/javascript" src="${url_for(assetPath)}"></script>`
    : `<link rel="stylesheet" href="${url_for(assetPath)}">`;
});
