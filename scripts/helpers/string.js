'use strict';

hexo.extend.helper.register('to_kebab_case', value => value.replace(' ', '-'));
