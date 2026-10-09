 
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("tb-blog-posts");

  const apiUrl =
    "https://blog.techbirja.com/wp-json/wp/v2/posts" +
    "?_embed&per_page=3&status=publish";

  function plainText(html) {
    const doc = new DOMParser().parseFromString(
      html || "", "text/html"
    );
    return doc.body.textContent.trim();
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Unable to load posts");
      }
      return response.json();
    })
    .then(function (posts) {
      if (!posts.length) {
        container.innerHTML =
          '<div class="col-12 text-center">' +
          'No articles published yet.</div>';
        return;
      }

      container.innerHTML = posts.map(function (post) {
        const title = plainText(post.title.rendered);
        const excerpt = plainText(post.excerpt.rendered);
        const date = new Date(post.date).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "short", day: "numeric" }
        );

        const media =
          post._embedded &&
          post._embedded["wp:featuredmedia"] &&
          post._embedded["wp:featuredmedia"][0];

        const image = media ? media.source_url : "";

        return `
          <div class="col-md-6 col-lg-4">
            <article class="tb-blog-card">
              ${
                image
                  ? `<img class="tb-blog-image"
                       src="${escapeHTML(image)}"
                       alt="${escapeHTML(title)}"
                       loading="lazy">`
                  : `<div class="tb-blog-image"></div>`
              }

              <div class="tb-blog-body">
                <div class="tb-blog-date">${escapeHTML(date)}</div>

                <h3 class="tb-blog-title">
                  ${escapeHTML(title)}
                </h3>

                <p class="tb-blog-excerpt">
                  ${escapeHTML(excerpt)}
                </p>

                <a class="tb-read-more"
                   href="${escapeHTML(post.link)}"
                   target="_blank"
                   rel="noopener">
                  Read Article &rarr;
                </a>
              </div>
            </article>
          </div>
        `;
      }).join("");
    })
    .catch(function (error) {
      console.error("TechBirja blog error:", error);
      container.innerHTML =
        '<div class="col-12 text-center">' +
        '<p>Articles could not be loaded right now.</p>' +
        '</div>';
    });
});
 
