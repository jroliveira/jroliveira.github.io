blog.post = function() {
  'use strict';

  class Post {
    constructor(data) {
      this.content = $('content', data).text();
      this.date = $('date', data).text();
      this.excerpt = $('excerpt', data).text();
      this.lang = $('lang', data).text();
      this.title = $('title', data).text();
      this.url = $('url', data).text();

      console.log(this);
    }

    contains(value) {
      console.log(value);

      let isMatch = true;

      value.split(/[\s\-]+/).forEach(keyword => {
        if (this.title.toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
          isMatch = false;
        }
      });

      return isMatch;
    }
  }

  return {
    toPosts: resp => $('entry', resp)
      .map(function() { console.log(this); return new Post(this) })
      .get()
  };

}();
