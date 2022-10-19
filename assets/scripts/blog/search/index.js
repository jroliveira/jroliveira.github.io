blog.search=function(){"use strict";function e(s){blog.elem.getByClass("posts-found").html(s.reduce((s,a)=>s+`<article class="post-item">
          <h5>
            <a class="post-item__title" href="${a.url}">
              ${a.title}
            </a>

            <p class="post__meta">
              <small>
                ${new Intl.DateTimeFormat("en",{year:"numeric",month:"long",day:"2-digit"}).format(new Date(a.date))}
              </small>

              <small>&nbsp; | &nbsp;</small>

              <small>
                <i class="fas fa-globe"></i>&nbsp;
                <a class="text--uppercase" href="${a.url}">${a.lang}</a>
              </small>

              <small>&nbsp; | &nbsp;</small>

              <small>
                <i class="fas fa-tags"></i>&nbsp;
                ${a.tags.map(s=>`<a href="/tags/${s.replace(" ","-")}/">${s}</a>`).join(" ")}
              </small>
            </p>
          </h5>

          <div class="post-item__excerpt">
            ${a.excerpt}
          </div>
        </article>`,""))}return{setup:()=>$.get("/search.xml").done(s=>{const l=blog.post.toPosts(s);e(l),blog.elem.getByClass("search-form__input").onChange(a=>e(l.filter(s=>s.contains(a))))})}}();