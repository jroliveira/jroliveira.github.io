const version = '2.5';

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

        'assets/images/shared/link-external.svg',

        'assets/images/social-networks/500px.svg',
        'assets/images/social-networks/github.svg',
        'assets/images/social-networks/instagram.svg',
        'assets/images/social-networks/linkedin.svg',
        'assets/images/social-networks/twitter.svg',

        'assets/images/x-wing/amg.png',

        'assets/fonts/Orbitron-Regular.ttf',
        'assets/fonts/raleway-light2.woff2',
        'assets/fonts/raleway-regular2.woff2',
        'assets/fonts/raleway-semibold2.woff2',
        'assets/styles/xwing-miniatures-ships.ttf',
        'assets/styles/xwing-miniatures.ttf',
        'assets/webfonts/fa-brands-400.ttf',
        'assets/webfonts/fa-brands-400.woff2',
        'assets/webfonts/fa-regular-400.ttf',
        'assets/webfonts/fa-regular-400.woff2',
        'assets/webfonts/fa-solid-900.ttf',
        'assets/webfonts/fa-solid-900.woff2',
        'assets/webfonts/fa-v4compatibility.ttf',
        'assets/webfonts/fa-v4compatibility.woff2',
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
