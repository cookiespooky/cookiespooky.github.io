(function () {
  function withBasePath(path) {
    var base = (window.__notepubBaseURL || "").replace(/\/+$/, "");
    if (!path) return base || "/";
    if (/^https?:\/\//.test(path)) return path;
    if (path.charAt(0) !== "/") path = "/" + path;
    return (base || "") + path;
  }

  function onIdle(fn) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(fn, { timeout: 1200 });
      return;
    }
    window.setTimeout(fn, 350);
  }

  function loadScript(src, attrs) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          script.setAttribute(key, attrs[key]);
        });
      }
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error("Failed to load script: " + src)); };
      document.head.appendChild(script);
    });
  }

  function initCodeHighlighting(scope) {
    var root = scope || document;
    var blocks = root.querySelectorAll(".prose pre code");
    if (!blocks.length) return;

    blocks.forEach(function (code) {
      var cls = code.className || "";
      if (!/\blanguage-/.test(cls)) {
        code.classList.add("language-none");
      }
    });

    function highlightNow() {
      if (!window.Prism || typeof window.Prism.highlightAllUnder !== "function") return;
      window.Prism.highlightAllUnder(root);
    }

    if (window.Prism) {
      highlightNow();
      return;
    }

    loadScript("https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js")
      .then(function () {
        return loadScript(
          "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js",
          { "data-autoloader-path": "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/" }
        );
      })
      .then(highlightNow)
      .catch(function () {
        // Fallback: keep default pre/code styles without syntax highlighting.
      });
  }

  function markExternalLinks(scope) {
    var root = scope || document;
    var links = root.querySelectorAll(".prose a[href]");
    if (!links.length) return;
    links.forEach(function (link) {
      if (link.dataset.externalMarked === "1") return;
      link.dataset.externalMarked = "1";

      var href = link.getAttribute("href") || "";
      if (!href || href.indexOf("#") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) {
        return;
      }
      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (e) {
        return;
      }
      var isHttp = /^https?:$/i.test(url.protocol);
      if (isHttp && url.origin !== window.location.origin) {
        link.classList.add("is-external");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.classList.remove("is-external");
      }
    });
  }

  function initHeadingAnchors(scope) {
    var root = scope || document;
    var headings = root.querySelectorAll(".prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6");
    if (!headings.length) return;

    var cyrMap = {
      "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
      "ж": "zh", "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m",
      "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
      "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "shch",
      "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya"
    };

    function slugify(text) {
      var s = (text || "").toLowerCase().trim();
      var out = "";
      for (var i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        out += Object.prototype.hasOwnProperty.call(cyrMap, ch) ? cyrMap[ch] : ch;
      }
      out = out
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      return out;
    }

    var used = Object.create(null);
    headings.forEach(function (h) {
      if (h.id) {
        used[h.id] = true;
        return;
      }
      var base = slugify(h.textContent || "");
      if (!base) return;
      var id = base;
      var n = 2;
      while (used[id] || document.getElementById(id)) {
        id = base + "-" + n;
        n += 1;
      }
      h.id = id;
      used[id] = true;
    });
  }

  function initSearchModal() {
    var modal = document.querySelector("[data-search-modal]");
    var openBtn = document.querySelector("[data-search-open]");
    var closeBtns = document.querySelectorAll("[data-search-close]");
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");

    if (!modal || !openBtn) return;

    var inited = false;
    var timeout;
    var staticIndexPromise = null;

    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      if (!inited) {
        initSearchLogic();
        inited = true;
      }
      if (input) input.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    function renderItems(items) {
      if (!results) return;
      if (!items || items.length === 0) {
        results.innerHTML = '<p class="muted">Пока ничего не найдено.</p>';
        return;
      }
      var html = "<ul>";
      items.forEach(function (item) {
        var title = item.title || "";
        var path = withBasePath(item.path || "");
        var snippet = item.snippet || "";
        var thumb = item.image || item.thumbnail || "/assets/placeholder.svg";
        if (!/^https?:\/\//.test(thumb)) thumb = withBasePath(thumb);
        html += '<li><a class="search-item-card" href="' + path + '">';
        html += '<img class="search-item-thumb" src="' + thumb + '" alt="" loading="lazy" decoding="async">';
        html += '<span class="search-item-body"><span class="search-item-title">' + title + "</span>";
        if (snippet) html += '<span class="search-item-snippet muted">' + snippet + "</span>";
        html += "</span></a></li>";
      });
      html += "</ul>";
      results.innerHTML = html;
    }

    function getStaticIndex() {
      if (staticIndexPromise) return staticIndexPromise;
      staticIndexPromise = fetch(withBasePath("/search.json"))
        .then(function (res) { return res.json(); })
        .then(function (data) { return data.items || []; })
        .catch(function () { return []; });
      return staticIndexPromise;
    }

    function fetchStatic(query) {
      return getStaticIndex().then(function (all) {
        var q = query.toLowerCase();
        var items = all.filter(function (item) {
          return (item.title || "").toLowerCase().indexOf(q) !== -1 ||
            (item.snippet || "").toLowerCase().indexOf(q) !== -1;
        }).slice(0, 10);
        renderItems(items);
      });
    }

    function fetchServer(query) {
      return fetch(withBasePath("/v1/search") + "?q=" + encodeURIComponent(query))
        .then(function (res) { return res.json(); })
        .then(function (data) { renderItems(data.items || []); })
        .catch(function () { renderItems([]); });
    }

    function runSearch(query) {
      if (!query || query.length < 2) {
        renderItems([]);
        return;
      }
      if (window.__notepubSearchMode === "static") {
        fetchStatic(query);
      } else {
        fetchServer(query);
      }
    }

    function initSearchLogic() {
      if (!input) return;
      input.addEventListener("input", function () {
        var q = input.value.trim();
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          runSearch(q);
        }, 180);
      });
    }

    openBtn.addEventListener("click", openModal);
    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  function initHubFilters() {
    var filterWrap = document.querySelector("[data-hub-filters]");
    if (!filterWrap) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-article-card]"));
    if (!cards.length) return;
    var titleEl = document.querySelector("[data-blog-title]");
    var descEl = document.querySelector("[data-blog-description]");

    function setActive(btn) {
      var buttons = filterWrap.querySelectorAll("[data-hub]");
      buttons.forEach(function (button) {
        button.classList.toggle("is-active", button === btn);
      });
    }

    function applyFilter(hub) {
      cards.forEach(function (card) {
        var hubs = (card.getAttribute("data-hubs") || "").split(/\s+/).filter(Boolean);
        var matches = hub === "all" || hubs.indexOf(hub) !== -1;
        card.classList.toggle("is-hidden", !matches);
      });
    }

    function applyHeader(btn) {
      if (!titleEl || !descEl || !btn) return;
      var title = btn.getAttribute("data-hub-title") || "Последние публикации по всем хабам";
      var desc = btn.getAttribute("data-hub-description") || "Выберите хаб, чтобы отфильтровать статьи.";
      titleEl.textContent = title;
      descEl.textContent = desc;
      descEl.style.display = "";
    }

    filterWrap.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.hasAttribute("data-hub")) return;
      var hub = target.getAttribute("data-hub");
      setActive(target);
      applyFilter(hub);
      applyHeader(target);
    });
  }

  var graphDataPromise = null;

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch " + path);
      return res.json();
    });
  }

  function getGraphData(url) {
    if (!graphDataPromise) {
      graphDataPromise = fetchJson(url);
    }
    return graphDataPromise;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildGraphLookup(graph) {
    var atoms = (graph && graph.atoms) || [];
    var map = Object.create(null);
    atoms.forEach(function (atom) {
      map[atom.id] = atom;
    });
    return map;
  }

  function graphAtomURL(atom) {
    return withBasePath(atom && atom.url ? atom.url : "/");
  }

  function createActionButton(action, atomMap) {
    var targetAtom = atomMap[action.target || action.id];
    var element = document.createElement("button");
    element.type = "button";
    element.className = "graph-action-pill";
    var label = action.label || "Открыть";
    label = label.replace(/^Перейти к\s+/i, "").trim();
    element.textContent = label || "Открыть";
    if (targetAtom) {
      element.setAttribute("data-graph-target", targetAtom.id);
    } else {
      element.disabled = true;
    }
    return element;
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function initGraphHome() {
    var root = document.querySelector("[data-graph-home]");
    if (!root) return;

    var graphUrl = root.getAttribute("data-graph-url");
    var endpointUrl = root.getAttribute("data-graph-endpoint");
    var streamEndpointUrl = root.getAttribute("data-graph-stream-endpoint") || endpointUrl;
    var startView = root.querySelector("[data-graph-start]");
    var articleView = root.querySelector("[data-graph-article-view]");
    var titleEl = root.querySelector("[data-graph-title]");
    var summaryEl = root.querySelector("[data-graph-summary]");
    var generatedEl = root.querySelector("[data-graph-generated]");
    var copyEl = root.querySelector("[data-graph-copy]");
    var actionsEl = root.querySelector("[data-graph-actions]");
    var kindEl = root.querySelector("[data-graph-kind]");
    var hubLabelEl = root.querySelector("[data-graph-hub-label]");
    var visualEl = root.querySelector("[data-graph-visual]");
    if (!graphUrl || !endpointUrl || !startView || !articleView || !copyEl) return;

    function normalizePathname(input) {
      if (!input) return "/";
      var path = input.replace(/^https?:\/\/[^/]+/i, "");
      path = path.replace(/[?#].*$/, "");
      path = path.replace(/\/+$/, "");
      return path || "/";
    }

    function renderLinkMarkup(text) {
      var source = String(text || "");
      var result = "";
      var cursor = 0;
      var match;
      var pattern = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/gi;

      while ((match = pattern.exec(source)) !== null) {
        result += escapeHtml(source.slice(cursor, match.index));
        result += '<a href="#" data-graph-target="' + escapeHtml(match[1]) + '">' + escapeHtml(match[2] || match[1]) + "</a>";
        cursor = pattern.lastIndex;
      }

      result += escapeHtml(source.slice(cursor));
      return result;
    }

    function renderArticleBody(markdownLike) {
      var blocks = String(markdownLike || "").replace(/\r\n/g, "\n").split(/\n{2,}/);
      return blocks.map(function (block) {
        var trimmed = block.trim();
        if (!trimmed) return "";
        if (trimmed.indexOf("## ") === 0) {
          return "<h2>" + renderLinkMarkup(trimmed.slice(3).trim()) + "</h2>";
        }
        return "<p>" + renderLinkMarkup(trimmed) + "</p>";
      }).join("");
    }

    function buildRouteLookup(graph) {
      var routeMap = Object.create(null);
      (graph.atoms || []).forEach(function (atom) {
        routeMap[normalizePathname(atom.url)] = atom.id;
      });
      return routeMap;
    }

    function showStartView() {
      startView.hidden = false;
      articleView.hidden = true;
      copyEl.innerHTML = "<p>Подготавливаю статью.</p>";
      actionsEl.innerHTML = "";
      root.classList.remove("is-streaming");
      root.classList.remove("is-graph-active");
      var url = new URL(window.location.href);
      url.searchParams.delete("atom");
      window.history.replaceState({}, "", url.toString());
    }

    function setLoading(atom) {
      startView.hidden = true;
      articleView.hidden = false;
      titleEl.textContent = "";
      summaryEl.textContent = "";
      kindEl.textContent = atom.kind;
      hubLabelEl.textContent = atom.hub;
      copyEl.innerHTML = "";
      actionsEl.innerHTML = "";
      if (visualEl) visualEl.innerHTML = "";
      root.classList.remove("is-streaming");
      root.classList.remove("is-graph-active");
    }

    function setError(message) {
      copyEl.innerHTML = '<p class="graph-error">' + escapeHtml(message) + "</p>";
      root.classList.remove("is-streaming");
      root.classList.remove("is-graph-active");
    }

    function typeText(element, text, speed, requestToken, state) {
      var content = String(text || "");
      element.textContent = "";
      if (!content) return Promise.resolve();

      return new Promise(function (resolve) {
        var index = 0;
        function tick() {
          if (state.requestToken !== requestToken) {
            resolve();
            return;
          }
          index += 1;
          element.textContent = content.slice(0, index);
          if (index >= content.length) {
            resolve();
            return;
          }
          window.setTimeout(tick, speed);
        }
        tick();
      });
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function renderMiniGraph(seed) {
      if (!visualEl) return;
      visualEl.innerHTML = "";

      var mainNode = document.createElement("span");
      mainNode.className = "graph-stream-node graph-stream-node-main";
      mainNode.style.left = "21px";
      mainNode.style.top = "21px";
      mainNode.style.setProperty("--graph-delay", "0s");
      visualEl.appendChild(mainNode);

      var used = [{ x: 25, y: 25 }];
      var auxCount = 4;

      for (var i = 0; i < auxCount; i += 1) {
        var x = 0;
        var y = 0;
        var attempts = 0;

        do {
          x = randomInt(3, 41);
          y = randomInt(3, 41);
          attempts += 1;
        } while (attempts < 20 && used.some(function (point) {
          var dx = point.x - (x + 3);
          var dy = point.y - (y + 3);
          return Math.sqrt(dx * dx + dy * dy) < 12;
        }));

        used.push({ x: x + 3, y: y + 3 });

        var node = document.createElement("span");
        node.className = "graph-stream-node graph-stream-node-aux";
        node.style.left = x + "px";
        node.style.top = y + "px";
        node.style.setProperty("--graph-delay", (0.18 * (i + 1)).toFixed(2) + "s");
        visualEl.appendChild(node);

        var edge = document.createElement("span");
        edge.className = "graph-stream-edge";
        var dxMain = (x + 3) - 25;
        var dyMain = (y + 3) - 25;
        var length = Math.sqrt(dxMain * dxMain + dyMain * dyMain);
        var angle = Math.atan2(dyMain, dxMain) * 180 / Math.PI;
        edge.style.left = "25px";
        edge.style.top = "25px";
        edge.style.width = Math.max(10, length) + "px";
        edge.style.transform = "rotate(" + angle.toFixed(2) + "deg)";
        edge.style.setProperty("--graph-delay", (0.12 + 0.18 * (i + 1)).toFixed(2) + "s");
        visualEl.appendChild(edge);
      }
    }

    function requestRuntimeArticle(atomId, trailIds) {
      return fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atomId: atomId,
          trail: trailIds || []
        })
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (payload) {
          if (!res.ok) {
            throw new Error(payload.error || "Не удалось сгенерировать статью.");
          }
          return payload;
        });
      });
    }

    function requestRuntimeArticleStream(atomId, trailIds, signal, handlers) {
      return fetch(streamEndpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atomId: atomId,
          trail: trailIds || []
        }),
        signal: signal
      }).then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (payload) {
            throw new Error(payload.error || "Не удалось сгенерировать статью.");
          });
        }
        if (!res.body || !window.TextDecoder) {
          return requestRuntimeArticle(atomId, trailIds).then(function (payload) {
            if (handlers && typeof handlers.onDone === "function") {
              handlers.onDone(payload);
            }
          });
        }

        var reader = res.body.getReader();
        var decoder = new TextDecoder("utf-8");
        var buffer = "";

        function processLine(line) {
          if (!line) return;
          var payload;
          try {
            payload = JSON.parse(line);
          } catch (error) {
            return;
          }

          if (payload.type === "start" && handlers && typeof handlers.onStart === "function") {
            handlers.onStart(payload);
          } else if (payload.type === "delta" && handlers && typeof handlers.onDelta === "function") {
            handlers.onDelta(payload);
          } else if (payload.type === "phase" && handlers && typeof handlers.onPhase === "function") {
            handlers.onPhase(payload);
          } else if (payload.type === "meta" && handlers && typeof handlers.onMeta === "function") {
            handlers.onMeta(payload);
          } else if (payload.type === "done" && handlers && typeof handlers.onDone === "function") {
            handlers.onDone(payload.article || payload);
          }
        }

        function pump() {
          return reader.read().then(function (chunk) {
            if (chunk.done) {
              if (buffer.trim()) processLine(buffer.trim());
              return;
            }

            buffer += decoder.decode(chunk.value, { stream: true });
            var lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || "";
            lines.forEach(function (line) {
              processLine(line.trim());
            });
            return pump();
          });
        }

        return pump();
      });
    }

    getGraphData(graphUrl).then(function (graph) {
      var atomMap = buildGraphLookup(graph);
      var routeMap = buildRouteLookup(graph);
      var hubMap = Object.create(null);
      (graph.hubs || []).forEach(function (hub) {
        hubMap[hub.id] = hub;
      });

      var params = new URLSearchParams(window.location.search);
      var initialAtomId = params.get("atom") || routeMap[normalizePathname(window.location.pathname)];
      var state = {
        trail: [],
        currentAtomId: "",
        streamController: null,
        requestToken: 0
      };

      function abortCurrentStream() {
        if (state.streamController) {
          state.streamController.abort();
          state.streamController = null;
        }
        root.classList.remove("is-streaming");
        root.classList.remove("is-graph-active");
      }

      async function renderRuntimeArticle(atomId) {
        var atom = atomMap[atomId];
        if (!atom) return;
        var hub = hubMap[atom.hub];
        var requestToken = state.requestToken + 1;
        var bodyBuffer = "";

        abortCurrentStream();
        state.requestToken = requestToken;

        state.currentAtomId = atom.id;
        if (state.trail[state.trail.length - 1] !== atom.id) {
          state.trail.push(atom.id);
        }

        setLoading(atom);
        kindEl.textContent = atom.kind;
        hubLabelEl.textContent = hub ? hub.title : atom.hub;

        await typeText(titleEl, atom.title, 18, requestToken, state);
        await typeText(summaryEl, atom.summary || "", 10, requestToken, state);
        if (state.requestToken !== requestToken) return;

        renderMiniGraph(atom.id);
        root.classList.add("is-graph-active");
        await wait(460);
        if (state.requestToken !== requestToken) return;

        copyEl.innerHTML = '<p class="graph-loading">Генерирую статью по связанным атомам...</p>';
        state.streamController = new AbortController();

        requestRuntimeArticleStream(
          atom.id,
          state.trail.slice(0, -1),
          state.streamController.signal,
          {
            onStart: function (payload) {
              if (state.requestToken !== requestToken) return;
              titleEl.textContent = payload.title || atom.title;
              summaryEl.textContent = payload.summary || atom.summary || "";
              actionsEl.innerHTML = "";
              copyEl.innerHTML = "";
              root.classList.remove("is-graph-active");
              root.classList.add("is-streaming");
            },
            onDelta: function (payload) {
              if (state.requestToken !== requestToken) return;
              bodyBuffer = payload.body || (bodyBuffer + (payload.delta || ""));
              copyEl.innerHTML = renderArticleBody(bodyBuffer);
            },
            onMeta: function (payload) {
              if (state.requestToken !== requestToken) return;
              titleEl.textContent = payload.title || titleEl.textContent;
              summaryEl.textContent = payload.summary || summaryEl.textContent;
              actionsEl.innerHTML = "";
              var metaActions = Array.isArray(payload.next_actions) ? payload.next_actions : [];
              metaActions.forEach(function (action) {
                actionsEl.appendChild(createActionButton(action, atomMap));
              });
            },
            onPhase: function (payload) {
              if (state.requestToken !== requestToken) return;
            },
            onDone: function (payload) {
              if (state.requestToken !== requestToken) return;
              state.streamController = null;
              root.classList.remove("is-streaming");
              root.classList.remove("is-graph-active");
              titleEl.textContent = payload.title || atom.title;
              summaryEl.textContent = payload.warning
                ? (payload.summary || atom.summary || "") + " Сейчас показан черновой графовый режим."
                : (payload.summary || atom.summary || "");
              copyEl.innerHTML = renderArticleBody(payload.body || bodyBuffer || "");
              actionsEl.innerHTML = "";

              var nextActions = Array.isArray(payload.next_actions) ? payload.next_actions : [];
              nextActions.forEach(function (action) {
                actionsEl.appendChild(createActionButton(action, atomMap));
              });

              var url = new URL(window.location.href);
              url.searchParams.set("atom", atom.id);
              window.history.replaceState({}, "", url.toString());
            }
          }
        ).catch(function (error) {
          if (error && error.name === "AbortError") return;
          if (state.requestToken !== requestToken) return;
          state.streamController = null;
          root.classList.remove("is-streaming");
          root.classList.remove("is-graph-active");
          setError(error && error.message ? error.message : "Не удалось сгенерировать статью.");
        });
      }

      if (initialAtomId && atomMap[initialAtomId]) {
        renderRuntimeArticle(initialAtomId);
      } else {
        showStartView();
      }

      root.addEventListener("click", function (event) {
        var runtimeTarget = event.target.closest("[data-graph-target]");
        if (runtimeTarget) {
          event.preventDefault();
          renderRuntimeArticle(runtimeTarget.getAttribute("data-graph-target"));
          return;
        }

        var anchor = event.target.closest("a[href]");
        if (!anchor) return;
        var href = anchor.getAttribute("href") || "";
        if (!href) return;
        var route = normalizePathname(href);
        var atomId = routeMap[route];
        if (atomId) {
          event.preventDefault();
          renderRuntimeArticle(atomId);
        }
      });

    }).catch(function () {
      setError("Не удалось загрузить граф.");
    });
  }

  function initGraphArticle() {
    var root = document.querySelector("[data-graph-article]");
    if (!root) return;

    var atomId = root.getAttribute("data-atom-id");
    var graphUrl = root.getAttribute("data-graph-url");
    var relatedEl = root.querySelector("[data-atom-related]");
    var actionsEl = root.querySelector("[data-atom-actions]");
    if (!atomId || !graphUrl || !relatedEl || !actionsEl) return;

    getGraphData(graphUrl).then(function (graph) {
      var atomMap = buildGraphLookup(graph);
      var atom = atomMap[atomId];
      if (!atom) return;

      relatedEl.innerHTML = "";
      (atom.links || []).map(function (link) {
        return atomMap[link.id];
      }).filter(Boolean).forEach(function (relatedAtom) {
        var link = document.createElement("a");
        link.className = "atom-side-link";
        link.href = graphAtomURL(relatedAtom);
        link.innerHTML = "<strong>" + escapeHtml(relatedAtom.title) + "</strong><span>" + escapeHtml(relatedAtom.summary) + "</span>";
        relatedEl.appendChild(link);
      });

      actionsEl.innerHTML = "";
      (atom.actions || []).forEach(function (action) {
        var targetAtom = atomMap[action.target];
        var link = document.createElement(targetAtom ? "a" : "span");
        link.className = "graph-action-pill";
        link.textContent = action.label || "Открыть";
        if (targetAtom) {
          link.href = withBasePath("/?atom=" + encodeURIComponent(targetAtom.id));
        }
        actionsEl.appendChild(link);
      });
    }).catch(function () {
      relatedEl.innerHTML = "<p class='muted'>Не удалось загрузить связи.</p>";
      actionsEl.innerHTML = "<p class='muted'>Не удалось загрузить действия.</p>";
    });
  }

  function initMobileNav() {
    var navPanel = document.querySelector("[data-nav-panel]");
    var navOpen = document.querySelector("[data-nav-open]");
    var navCloseBtns = document.querySelectorAll("[data-nav-close]");
    var header = document.querySelector(".site-header");
    if (!navPanel || !navOpen || !header) return;

    function lockBodyScroll() {
      document.body.classList.add("nav-open");
    }

    function unlockBodyScroll() {
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      navPanel.classList.add("is-open");
      navPanel.setAttribute("aria-hidden", "false");
      lockBodyScroll();
      navOpen.classList.add("is-open");
      navOpen.setAttribute("aria-label", "Закрыть навигацию");
    }

    function closeNav() {
      navPanel.classList.remove("is-open");
      navPanel.setAttribute("aria-hidden", "true");
      unlockBodyScroll();
      navOpen.classList.remove("is-open");
      navOpen.setAttribute("aria-label", "Открыть навигацию");
    }

    function toggleNav() {
      if (navPanel.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    }

    navOpen.addEventListener("click", toggleNav);
    navCloseBtns.forEach(function (btn) {
      btn.addEventListener("click", closeNav);
    });

    header.addEventListener("click", function (event) {
      var target = event.target;
      if (!target) return;
      var button = target.closest("a, button");
      if (!button) return;
      if (button.hasAttribute("data-nav-open")) return;
      closeNav();
    });

    function setHeaderHeight() {
      document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
    }

    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
  }

  function parseNpEmbedConfig(raw) {
    var config = {};
    if (!raw) return config;
    raw.split(/\r?\n/).forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return;
      var idx = trimmed.indexOf(":");
      if (idx <= 0) return;
      var key = trimmed.slice(0, idx).trim().toLowerCase();
      var value = trimmed.slice(idx + 1).trim();
      if (!value) return;
      config[key] = value;
    });
    return config;
  }

  function initMarkdownEmbeds(scope) {
    var root = scope || document;
    var blocks = root.querySelectorAll("pre > code.language-np-embed");
    if (!blocks.length) return;

    blocks.forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || pre.dataset.embedInited === "1") return;
      pre.dataset.embedInited = "1";

      var cfg = parseNpEmbedConfig(code.textContent || "");
      var id = (cfg.id || "").toLowerCase();

      // Allow only simple slug-like ids to avoid path injection.
      if (!/^[a-z0-9-]+$/.test(id)) return;

      var title = cfg.title || ("Animation: " + id);
      var src = withBasePath("/assets/animations/" + id + "/index.html?motion=on");

      var wrapper = document.createElement("div");
      wrapper.className = "np-embed";

      var iframe = document.createElement("iframe");
      iframe.className = "np-embed-frame";
      iframe.src = src;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer";
      // Needed for fetch/XHR to same-site assets from inside the sandboxed iframe.
      iframe.sandbox = "allow-scripts allow-same-origin";
      iframe.style.width = "100%";
      iframe.style.aspectRatio = "1 / 1";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.style.background = "#fff";

      wrapper.appendChild(iframe);
      pre.replaceWith(wrapper);
    });
  }

  function initAgencyAnalyzer() {
    var root = document.querySelector("[data-agency-analyzer]");
    if (!root) return;

    var endpoint = root.getAttribute("data-endpoint") || "";
    var form = root.querySelector("[data-aa-form]");
    var textArea = root.querySelector("[data-aa-text]");
    var inputShell = root.querySelector("[data-aa-input-shell]");
    var counter = root.querySelector("[data-aa-char-count]");
    var submitRow = root.querySelector("[data-aa-submit-row]");
    var output = root.querySelector("[data-aa-output]");
    var loader = root.querySelector("[data-aa-loader]");
    var result = root.querySelector("[data-aa-result]");
    var sourceTextEl = root.querySelector("[data-aa-source-text]");
    var resultText = root.querySelector("[data-aa-result-text]");
    var resultAnalysis = root.querySelector("[data-aa-result-analysis]");
    var retryBtn = root.querySelector("[data-aa-retry]");
    var retryWrap = root.querySelector("[data-aa-retry-wrap]");
    var errorBox = root.querySelector("[data-aa-error]");
    var creatorLink = root.querySelector("[data-aa-creator-link]");

    var filterWrap = root.querySelector("[data-aa-filter-wrap]");
    var filterToggle = root.querySelector("[data-aa-filter-toggle]");
    var filterMenu = root.querySelector("[data-aa-filter-menu]");
    var filterOptions = Array.prototype.slice.call(root.querySelectorAll("[data-aa-filter-option]"));
    var currentFilterLabel = root.querySelector("[data-aa-current-filter-label]");

    if (!form || !textArea || !inputShell || !output || !loader || !result || !retryBtn || !filterToggle || !filterMenu) return;

    var state = {
      selectedFilter: "neutral",
      results: null,
      sourceText: "",
      loading: false
    };

    var filterToneMap = {
      neutral: { label: "нейтральный", color: "#1ea971" },
      direct: { label: "прямолинейный", color: "#6ccf5a" },
      radical: { label: "радикальный", color: "#d8a437" },
      aggressive: { label: "агрессивный", color: "#d57431" },
      toxic: { label: "токсичный", color: "#c2463b" }
    };

    function setError(message) {
      if (!errorBox) return;
      if (!message) {
        errorBox.hidden = true;
        errorBox.textContent = "";
        return;
      }
      errorBox.hidden = false;
      errorBox.textContent = message;
    }

    function updateCounter() {
      if (!counter) return;
      counter.textContent = String((textArea.value || "").length);
    }

    function updateCreatorLink(sourceText) {
      if (!creatorLink) return;
      var text = (sourceText || textArea.value || "").trim();
      var message = text ? ("Привет, Антон! " + text) : "Привет, Антон!";
      creatorLink.href = "https://t.me/cookiespooky?text=" + encodeURIComponent(message);
    }

    function autoGrowTextArea() {
      textArea.style.height = "auto";
      textArea.style.height = textArea.scrollHeight + "px";
    }

    function closeFilterMenu() {
      filterMenu.hidden = true;
      filterToggle.setAttribute("aria-expanded", "false");
    }

    function openFilterMenu() {
      filterMenu.hidden = false;
      filterToggle.setAttribute("aria-expanded", "true");
    }

    function updateFilterToggle() {
      var tone = filterToneMap[state.selectedFilter] || filterToneMap.neutral;
      if (currentFilterLabel) {
        currentFilterLabel.textContent = tone.label;
        currentFilterLabel.style.color = tone.color;
      }
    }

    function selectFilter(key) {
      state.selectedFilter = key;
      filterOptions.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-filter-key") === key);
      });
      updateFilterToggle();
      closeFilterMenu();
      if (state.results) renderResult();
    }

    function renderResult() {
      if (!state.results) return;
      var data = state.results[state.selectedFilter];
      if (!data) return;
      if (sourceTextEl) sourceTextEl.textContent = state.sourceText || "";
      resultText.textContent = data.objective_text || "";
      resultAnalysis.textContent = data.agency_analysis || "";
      result.hidden = false;
    }

    function setLoading(loading) {
      state.loading = loading;
      root.classList.toggle("is-loading", loading);
      output.hidden = false;
      loader.hidden = !loading;
      if (loading) {
        retryBtn.hidden = true;
      }
      if (retryWrap) retryWrap.hidden = loading || !state.results || retryBtn.hidden;
      if (loading) {
        result.hidden = true;
      }
    }

    function showInputMode() {
      root.classList.remove("is-result-mode");
      inputShell.hidden = false;
      if (submitRow) submitRow.hidden = false;
      output.hidden = true;
      loader.hidden = true;
      result.hidden = true;
      retryBtn.hidden = true;
      if (retryWrap) retryWrap.hidden = true;
      state.results = null;
      state.sourceText = "";
      updateCreatorLink("");
      setError("");
      autoGrowTextArea();
      textArea.focus();
      updateCounter();
    }

    async function submitOnce(text) {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });

      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        throw new Error((data && (data.details || data.error)) || "Что-то пошло не так. Попробуйте еще раз");
      }
      if (!data || !data.results) {
        throw new Error("Пустой ответ от сервиса");
      }
      return data.results;
    }

    filterToggle.addEventListener("click", function () {
      if (filterMenu.hidden) openFilterMenu();
      else closeFilterMenu();
    });

    filterOptions.forEach(function (option) {
      option.addEventListener("click", function () {
        var key = option.getAttribute("data-filter-key");
        if (!key) return;
        selectFilter(key);
      });
    });

    document.addEventListener("click", function (event) {
      if (!filterWrap.contains(event.target)) closeFilterMenu();
    });

    textArea.addEventListener("input", function () {
      autoGrowTextArea();
      updateCounter();
      if (!state.sourceText) updateCreatorLink("");
    });

    textArea.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (state.loading) return;
      if (typeof form.requestSubmit === "function") {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    });

    retryBtn.addEventListener("click", function () {
      showInputMode();
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (state.loading) return;

      var text = (textArea.value || "").trim();
      if (!text) {
        setError("Введите фразу для анализа.");
        return;
      }
      if (text.length > 500) {
        setError("Лимит: 500 символов.");
        return;
      }
      if (!endpoint) {
        setError("Не задан endpoint API.");
        return;
      }

      setError("");
      closeFilterMenu();
      state.sourceText = text;
      updateCreatorLink(text);
      inputShell.hidden = true;
      if (submitRow) submitRow.hidden = true;
      retryBtn.hidden = true;
      setLoading(true);

      try {
        state.results = await submitOnce(text);
        setLoading(false);
        inputShell.hidden = false;
        root.classList.add("is-result-mode");
        renderResult();
        retryBtn.hidden = false;
        if (retryWrap) retryWrap.hidden = false;
      } catch (err) {
        setLoading(false);
        output.hidden = true;
        inputShell.hidden = false;
        if (submitRow) submitRow.hidden = false;
        setError(err && err.message ? err.message : "Что-то пошло не так. Попробуйте еще раз");
      }
    });

    updateCounter();
    autoGrowTextArea();
    updateFilterToggle();
    updateCreatorLink("");
  }

  initMarkdownEmbeds(document.querySelector("main") || document);
  initAgencyAnalyzer();
  initGraphHome();
  initGraphArticle();
  initSearchModal();
  initHubFilters();
  initMobileNav();

  if (window.location.hash) {
    window.setTimeout(function () {
      initHeadingAnchors(document.querySelector("main") || document);
      var id = decodeURIComponent(window.location.hash.slice(1));
      var target = document.getElementById(id);
      if (target) target.scrollIntoView();
    }, 0);
  } else {
    onIdle(function () {
      initHeadingAnchors(document.querySelector("main") || document);
    });
  }

  window.addEventListener("hashchange", function () {
    var hash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    if (!hash) return;
    var target = document.getElementById(hash);
    if (target) {
      target.scrollIntoView();
      return;
    }
    initHeadingAnchors(document.querySelector("main") || document);
    target = document.getElementById(hash);
    if (target) target.scrollIntoView();
  });

  onIdle(function () {
    markExternalLinks(document.querySelector("main") || document);
  });

  onIdle(function () {
    initCodeHighlighting(document.querySelector("main") || document);
  });
})();
