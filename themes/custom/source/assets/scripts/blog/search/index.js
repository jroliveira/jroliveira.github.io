blog.search = function () {
  'use strict';

  function showResult(posts) {
    blog.elem
      .getByClass('posts-found')
      .html(posts.reduce((prev, post) => prev +=
        `<article class="post-item">
          <h5>
            <a class="post-item__title" href="${post.url}">
              ${post.title}
            </a>

            <p class="post__meta">
              <small>
                ${new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(post.date))}
              </small>

              <small>&nbsp; | &nbsp;</small>

              <small>
                <i class="fas fa-globe"></i>&nbsp;
                <a class="text--uppercase" href="${post.url}">${post.lang}</a>
              </small>

              <small>&nbsp; | &nbsp;</small>

              <small>
                <i class="fas fa-tags"></i>&nbsp;
                ${post.tags.map(tag => `<a href="/tags/${tag.replace(' ', '-')}/">${tag}</a>`).join(' ')}
              </small>
            </p>
          </h5>

          <div class="post-item__excerpt">
            ${post.excerpt}
          </div>
        </article>`, ''));
  }

  return {
    setup: () => $.get('/search.xml').done(resp => {
      const posts = blog.post.toPosts(resp);

      showResult(posts);

      blog.elem
        .getByClass('search-form__input')
        .onChange(value => showResult(posts.filter(post => post.contains(value))));
    }),
  };
}();
