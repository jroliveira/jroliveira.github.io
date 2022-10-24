'use strict';

hexo.extend.filter.register('after_generate', function () {
  const md5 = require('md5');

  const endpoint = '/assets/styles/main.css';

  return new Promise((resolve, reject) => {
    let content = '';

    const stream = hexo.route.get(endpoint);
    stream.on('data', chunk => (content += chunk));
    stream.on('end', () => {
      const hash = md5(content).substring(0, 6);
      const newEndpoint = `/assets/styles/main.${hash}.css`

      const hashedAssets = hexo.locals.get('hashedAssets') ?? [];
      hashedAssets.push({
        original: endpoint,
        hashed: newEndpoint,
      });

      hexo.route.remove(endpoint);
      hexo.route.set(newEndpoint, content);

      resolve();
    });
  });
});
