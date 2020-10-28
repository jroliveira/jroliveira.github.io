const version = '2.1';

self
  .addEventListener('install', event => event
    .waitUntil(caches
      .open(`static-v${version}`)
      .then(cache => cache.addAll([
        'manifest.json',
        'assets/images/favicon.png',
        'assets/images/favicon@128.png',
        'assets/images/favicon@256.png',
        'assets/images/favicon@512.png',
        'assets/images/favicon.svg',
        'assets/images/twitter.svg',
        'assets/images/linkedin.svg',
        'assets/images/github.svg',
        'assets/fonts/fontawesome-webfont.woff2?v=4.7.0',
        'assets/fonts/raleway-light2.woff2',
        'assets/fonts/raleway-regular2.woff2',
        'assets/fonts/raleway-semibold2.woff2',
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
