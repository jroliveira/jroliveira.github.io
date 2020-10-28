/* global hexo */

'use strict';

hexo.extend.helper.register('to_kebab_case', value => value.replace(' ', '-'));

hexo.extend.helper.register('tag_font_size', tag => (tag.length * 4) + 80);

hexo.extend.helper.register('tag_count', tag => tag.posts
  .filter((post, pos) => tag.posts
    .map(item => item.date.format())
    .indexOf(post.date.format()) == pos)
  .length);
