const version = '2.3';

self
  .addEventListener('install', event => event
    .waitUntil(caches
      .open(`static-v${version}`)
      .then(cache => cache.addAll([
        'manifest.json',
        'assets/images/favicon.png',
        'assets/images/favicon.svg',
        'assets/images/favicon@128.png',
        'assets/images/favicon@256.png',
        'assets/images/favicon@512.png',

        'assets/images/menu/poem.svg',

        'assets/images/social-networks/500px.svg',
        'assets/images/social-networks/github.svg',
        'assets/images/social-networks/instagram.svg',
        'assets/images/social-networks/linkedin.svg',
        'assets/images/social-networks/twitter.svg',

        'assets/fonts/Orbitron-Regular.ttf',
        'assets/fonts/raleway-light2.woff2',
        'assets/fonts/raleway-regular2.woff2',
        'assets/fonts/raleway-semibold2.woff2',
        'assets/fonts/xwing-miniatures-ships.ttf',
        'assets/fonts/xwing-miniatures.ttf',
      ]))));

self
  .addEventListener('activate', event => event
    .waitUntil(caches
      .keys()
      .then(keys => Promise.all(keys
        .filter(key => key.indexOf(`static-v${version}`) !== 0)
        .map(key => caches.delete(key))))));

self
  .addEventListener('fetch', event => event
    .respondWith(caches
      .match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))));
