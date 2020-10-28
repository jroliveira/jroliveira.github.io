blog.search = function () {
  'use strict';

  function showResult(posts) {
    let content = '';

    posts.forEach(post => {
      content += `
<article class="post-item">
  <h5>
    <a class="post-item__title" href="${post.url}" title="${post.title}">${post.title}</a>
    <p class="post__meta">
      <small class="text--gray">${new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(post.date))}</small>
      <small>&nbsp; | &nbsp;</small>
      <small>
        <i class="fa fa-globe"></i>&nbsp;
        <a class="text--uppercase" href="${post.url}">${post.lang}</a>
      </small>
    </p>
  </h5>
  <div class="post-item__excerpt">${post.excerpt}</div>
  <a class="button" href="${post.url}" title="read more about ${post.title}">Read more »</a>
</article>
      `;
    });

    blog.elem
      .getById('postsFound')
      .html(content);
  }

  return {
    setup: () => $.get('/search.xml').done(resp => blog.elem
      .getById('searchPost')
      .onChange(value => showResult(blog.post
        .toPosts(resp)
        .filter(post => post.contains(value))))),
  };
}();
