/* global hexo */

'use strict';

hexo.extend.generator.register('xml', function (locals) {
  const nunjucks = require('nunjucks');
  const env = new nunjucks.Environment();
  env.addFilter('uriencode', str => encodeURI(str));
  env.addFilter('noControlChars', str => str && str.replace(/[\x00-\x1F\x7F]/g, ''));

  return {
    path: 'search.xml',
    data: nunjucks
      .compile(require('fs').readFileSync('themes/custom/layout/_widget/search.xml', 'utf8'), env)
      .render({
        posts: locals.posts.sort('-date'),
        url: '',
      }),
  };
});
