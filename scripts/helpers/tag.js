'use strict';

hexo.extend.helper.register('tag_font_size', tag => (tag.length * 4) + 80);

hexo.extend.helper.register('tag_count', tag => tag.posts.length);
