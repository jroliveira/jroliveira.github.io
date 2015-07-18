/* eslint-disable */

var CACHE_NAME = 'static-v2';

self
  .addEventListener('install', event => event
    .waitUntil(caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        'favicon.png',
        'manifest.json',
        'css/style.css',
        'fonts/fontawesome-webfont.woff2?v=4.7.0',
        'fonts/raleway-light2.woff2',
        'fonts/raleway-regular2.woff2',
        'fonts/raleway-semibold2.woff2',
        'en/',
        'pt/',
      ]))));

self
  .addEventListener('activate', event => event
    .waitUntil(caches
      .keys()
      .then(keys => Promise.all(keys
        .filter(key => key.indexOf(CACHE_NAME) !== 0)
        .map(key => caches.delete(key))))));

self
  .addEventListener('fetch', event => event
    .respondWith(caches
      .match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))));
