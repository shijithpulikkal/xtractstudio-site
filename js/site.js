/* Xtract Studio — site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector(".menu-btn");
  var navLinks = document.getElementById("nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* ---- Hero chart: measure the line so the draw animation fits it ---- */
  var heroLine = document.querySelector(".hero-chart .line");
  if (heroLine && heroLine.getTotalLength) {
    heroLine.style.setProperty("--len", Math.ceil(heroLine.getTotalLength()));
  }

  /* ---- Intro video: load YouTube only on click. On a local file:// preview
     YouTube refuses to play (error 153), so open it on YouTube instead. ---- */
  document.querySelectorAll("[data-yt]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!/^https?:$/.test(location.protocol)) return; // let the link open YouTube
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube.com/embed/" + link.dataset.yt + "?autoplay=1&rel=0";
      f.title = "Shijith Pulikkal, Xtract Studio introduction";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.allowFullscreen = true;
      var box = document.createElement("div");
      box.className = "video";
      box.appendChild(f);
      link.replaceWith(box);
    });
  });

  /* ---- Work gallery: platform switch, filters, show more ---- */
  var PAGE = 12;
  document.querySelectorAll("[data-work]").forEach(function (root) {
    var tabs = root.querySelectorAll('[role="tab"]');
    var panels = root.querySelectorAll(".work-panel");

    function showPanel(id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("aria-controls") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p.id !== id; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { showPanel(t.getAttribute("aria-controls")); });
      t.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus(); next.click();
      });
    });

    panels.forEach(function (panel) {
      var items = Array.prototype.slice.call(panel.querySelectorAll(".work-item"));
      var buttons = panel.querySelectorAll(".filters button");
      var more = panel.querySelector(".work-more");
      var moreBtn = more && more.querySelector("button");
      var filter = "all";
      var limit = PAGE;

      function render() {
        var matches = items.filter(function (li) {
          return filter === "all" || li.dataset.cats.split(" ").indexOf(filter) > -1;
        });
        items.forEach(function (li) { li.hidden = true; });
        matches.forEach(function (li, i) { li.hidden = i >= limit; });
        if (more) {
          var left = matches.length - limit;
          more.hidden = left <= 0;
          if (moreBtn && left > 0) moreBtn.textContent = "Show " + left + " more";
        }
      }
      buttons.forEach(function (b) {
        b.addEventListener("click", function () {
          buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          filter = b.dataset.filter;
          limit = PAGE;
          render();
        });
      });
      if (moreBtn) moreBtn.addEventListener("click", function () { limit = Infinity; render(); });
      render();
    });
  });

  /* ---- Blog: latest posts from Hashnode ---- */
  var HOST = "xtractstudio.hashnode.dev";
  var BLOG_URL = "https://" + HOST + "/";

  // Shown if the Hashnode API can't be reached (offline, blocked, etc.)
  var FALLBACK = [
    {
      title: "From Kroger Ad Platform API to BigQuery, Looker Studio and Base44 App",
      brief: "How I scheduled a Cloud Run job that loads Kroger Ad Platform reporting into BigQuery every day, worked around an intermittent CDN block, and turned the data into Looker Studio dashboards and a Base44 app.",
      url: "https://xtractstudio.hashnode.dev/from-kroger-ad-platform-api-to-bigquery-looker-studio-and-base44-app",
      publishedAt: "2026-11-13T07:50:38.898Z",
      readTimeInMinutes: 12,
      coverImage: { url: "https://cdn.hashnode.com/uploads/covers/6af6a1bd8517d1ad2006baa1/cdbade8c-42c6-4ee6-912d-f3d0c065203b.png" },
      tags: [{ name: "BigQuery" }, { name: "Cloud Run" }, { name: "Looker Studio" }, { name: "Retail Media" }]
    }
  ];

  // Front page (data-pinned): always these four, in this order. Fresh data from
  // the feed is used when a post is in it; otherwise the copy below is shown.
  var CDN = "https://cdn.hashnode.com/uploads/covers/6af6a1bd8517d1ad2006baa1/";
  var PINNED = [
    {
      title: "Instacart Ads API to BigQuery: Powering Looker Studio Dashboards and a Base44 App",
      url: BLOG_URL + "instacart-ads-api-to-bigquery-powering-looker-studio-dashboards-and-a-base44-app",
      publishedAt: "2026-11-13T15:35:45.000Z",
      readTimeInMinutes: 7,
      brief: "Pull Instacart Ads API reports into BigQuery with Cloud Run, then power Looker Studio dashboards and a Base44 app. OAuth, backfills, gotchas.",
      coverImage: { url: CDN + "d58312ce-a82d-4869-99a2-2117b1f72da8.png" },
      tags: [{ name: "bigquery" }, { name: "Google Cloud Platform" }, { name: "api" }, { name: "data-engineering" }]
    },
    {
      title: "How We Pipe DoorDash Ads API Data into BigQuery for Looker Studio and Base44",
      url: BLOG_URL + "how-we-pipe-doordash-ads-api-data-into-bigquery-for-looker-studio-and-base44",
      publishedAt: "2026-11-13T17:18:44.000Z",
      readTimeInMinutes: 8,
      brief: "From async report downloads to dashboards: a production-ready retail media pipeline on Google Cloud",
      coverImage: { url: CDN + "db8af27f-0ef6-473c-9b0e-3310f55bf820.png" },
      tags: []
    },
    {
      title: "From Kroger Ad Platform API to BigQuery, Looker Studio and Base44 App",
      url: BLOG_URL + "from-kroger-ad-platform-api-to-bigquery-looker-studio-and-base44-app",
      publishedAt: "2026-11-13T07:50:38.000Z",
      readTimeInMinutes: 9,
      brief: "Load Kroger Ad Platform reporting into BigQuery with Cloud Run, then build Looker Studio and Base44 dashboards, with retries and alerts.",
      coverImage: { url: CDN + "af82dab1-4936-4823-ac2a-9d09cb7eb282.png" },
      tags: [{ name: "bigquery" }, { name: "google cloud" }, { name: "cloud run" }, { name: "looker studio" }]
    },
    {
      title: "Ask Claude for GA4 and Google Ads Reports: Connecting Make.com MCP with Dynamic Dates",
      url: BLOG_URL + "ask-claude-for-ga4-and-google-ads-reports-connecting-make-com-mcp-with-dynamic-dates",
      publishedAt: "2026-11-14T07:48:38.000Z",
      readTimeInMinutes: 9,
      brief: "Connect Claude to Make.com’s MCP server and pull GA4 and Google Ads reports into chat for any date range, using scenario inputs as dynamic dates.",
      coverImage: { url: CDN + "a0032d9e-fd9d-4a6e-8df4-a770b37cb982.png" },
      tags: [{ name: "claude" }, { name: "mcp" }, { name: "ga4" }, { name: "google ads" }]
    }
  ];
  function pinned(posts) {
    return PINNED.map(function (pin) {
      var live = (posts || []).filter(function (p) { return p.url === pin.url; })[0];
      return live || pin;
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function card(p, withTags) {
    var li = el("article", "post");
    var a = el("a");
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    var cover = el("div", "post-cover");
    if (p.coverImage && p.coverImage.url) {
      var img = el("img");
      img.src = p.coverImage.url + (p.coverImage.url.indexOf("?") > -1 ? "" : "?w=1200&auto=compress,format&format=webp");
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () { cover.innerHTML = ""; cover.classList.add("blank"); cover.textContent = "Xtract Studio"; };
      cover.appendChild(img);
    } else {
      cover.classList.add("blank");
      cover.textContent = "Xtract Studio";
    }
    a.appendChild(cover);
    var body = el("div");
    var meta = el("div", "meta");
    var t = el("time", null, fmtDate(p.publishedAt));
    t.dateTime = p.publishedAt;
    meta.appendChild(t);
    if (p.readTimeInMinutes) meta.appendChild(document.createTextNode(", " + p.readTimeInMinutes + " min read"));
    body.appendChild(meta);
    body.appendChild(el("h3", null, p.title));
    if (p.brief) body.appendChild(el("p", null, p.brief));
    if (withTags && p.tags && p.tags.length) {
      var ul = el("ul", "tags");
      p.tags.slice(0, 4).forEach(function (tg) { ul.appendChild(el("li", null, tg.name)); });
      body.appendChild(ul);
    }
    a.appendChild(body);
    li.appendChild(a);
    return li;
  }

  var blogRoots = document.querySelectorAll("[data-blog]");
  if (blogRoots.length) {
    var max = 0;
    blogRoots.forEach(function (r) { max = Math.max(max, parseInt(r.dataset.limit || "12", 10)); });
    var query = "query($host:String!,$first:Int!){publication(host:$host){posts(first:$first){edges{node{title brief url publishedAt readTimeInMinutes coverImage{url} tags{name}}}}}}";

    // 1. js/posts.js on this site (kept fresh by a GitHub Action). Loaded as a
    //    script, so it also works when a page is opened straight from disk.
    // 2. Live Hashnode API, in case that file is missing.
    // 3. The single built-in post above.
    function fromSite() {
      var data = window.XTRACT_POSTS;
      if (data && data.posts && data.posts.length) return Promise.resolve(data.posts);
      return Promise.reject(new Error("No js/posts.js"));
    }
    function fromHashnode() {
      return fetch("https://gql.hashnode.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query, variables: { host: HOST, first: Math.min(max, 50) } })
      })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (json) {
          var edges = json && json.data && json.data.publication && json.data.publication.posts.edges;
          if (!edges || !edges.length) throw new Error("No posts in response");
          return edges.map(function (e) { return e.node; });
        });
    }

    fromSite()
      .catch(fromHashnode)
      .catch(function () { return FALLBACK; })
      .then(function (posts) {
        blogRoots.forEach(function (root) {
          var limit = parseInt(root.dataset.limit || "12", 10);
          var withTags = root.hasAttribute("data-tags");
          var list = root.hasAttribute("data-pinned") ? pinned(posts) : posts.slice(0, limit);
          root.innerHTML = "";
          root.setAttribute("aria-busy", "false");
          if (!list.length) {
            var p = el("p", "blog-status");
            p.innerHTML = 'New articles are on the way. Follow along on <a class="text-link" href="' + BLOG_URL + '" target="_blank" rel="noopener">Hashnode</a>.';
            root.appendChild(p);
            return;
          }
          list.forEach(function (post) { root.appendChild(card(post, withTags)); });
        });
      });
  }
})();
