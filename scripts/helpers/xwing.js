'use strict';

hexo.extend.helper.register('xw_symbol', function (name) {
  const partial = hexo.extend.helper.get('partial').bind(this);
  return partial(`x-wing/_symbols/${name}`);
});

hexo.extend.helper.register('xw_token', function (name) {
  const partial = hexo.extend.helper.get('partial').bind(this);
  return partial(`x-wing/_tokens/${name}`);
});
