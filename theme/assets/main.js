(function () {
  function withBasePath(path) {
    var base = (window.__notepubBaseURL || '').replace(/\/+$/, '');
    if (!path) return base || '/';
    if (/^https?:\/\//.test(path)) return path;
    if (path.charAt(0) !== '/') path = '/' + path;
    return (base || '') + path;
  }

  var modal = document.querySelector('[data-search-modal]');
  var openBtn = document.querySelector('[data-search-open]');
  var closeBtns = document.querySelectorAll('[data-search-close]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    if (input) input.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function renderItems(items) {
    if (!results) return;
    if (!items || items.length === 0) {
      results.innerHTML = '<p class="muted">Пока ничего не найдено.</p>';
      return;
    }
    var html = '<ul>';
    items.forEach(function (item) {
      var title = item.title || '';
      var path = withBasePath(item.path || '');
      var snippet = item.snippet || '';
      var thumb = item.image || item.thumbnail || '/assets/placeholder.svg';
      if (!/^https?:\/\//.test(thumb)) thumb = withBasePath(thumb);
      html += '<li><a class="search-item-card" href="' + path + '">';
      html += '<img class="search-item-thumb" src="' + thumb + '" alt="" loading="lazy" decoding="async">';
      html += '<span class="search-item-body"><span class="search-item-title">' + title + '</span>';
      if (snippet) html += '<span class="search-item-snippet muted">' + snippet + '</span>';
      html += '</span></a></li>';
    });
    html += '</ul>';
    results.innerHTML = html;
  }

  function fetchStaticIndex(query) {
    return fetch(withBasePath('/search.json'))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var q = query.toLowerCase();
        var items = (data.items || []).filter(function (item) {
          return (item.title || '').toLowerCase().includes(q) ||
            (item.snippet || '').toLowerCase().includes(q);
        }).slice(0, 10);
        renderItems(items);
      });
  }

  function fetchServer(query) {
    return fetch(withBasePath('/v1/search') + '?q=' + encodeURIComponent(query))
      .then(function (res) { return res.json(); })
      .then(function (data) { renderItems(data.items || []); });
  }

  function wireSearchInput() {
    if (!input) return;
    var timeout;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < 2) {
        renderItems([]);
        return;
      }
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        if (window.__notepubSearchMode === 'static') {
          fetchStaticIndex(q);
        } else {
          fetchServer(q);
        }
      }, 200);
    });
  }

  wireSearchInput();
})();

(function () {
  var links = document.querySelectorAll('.prose a[href]');
  if (!links.length) return;
  var host = window.location.hostname;
  links.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (!href || href.indexOf('#') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
      return;
    }
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return;
    }
    if (url.hostname && url.hostname !== host) {
      link.classList.add('is-external');
    }
  });
})();

(function () {
  var headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
  if (!headings.length) return;

  var cyrMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  function slugify(text) {
    var s = (text || '').toLowerCase().trim();
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      out += Object.prototype.hasOwnProperty.call(cyrMap, ch) ? cyrMap[ch] : ch;
    }
    out = out
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return out;
  }

  var used = Object.create(null);
  headings.forEach(function (h) {
    if (h.id) {
      used[h.id] = true;
      return;
    }
    var base = slugify(h.textContent || '');
    if (!base) return;
    var id = base;
    var n = 2;
    while (used[id] || document.getElementById(id)) {
      id = base + '-' + n;
      n += 1;
    }
    h.id = id;
    used[id] = true;
  });

  function scrollToHash() {
    var hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (!hash) return;
    var id = decodeURIComponent(hash);
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView();
  }

  scrollToHash();
  window.addEventListener('hashchange', scrollToHash);
})();

(function () {
  var filterWrap = document.querySelector('[data-hub-filters]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-article-card]'));
  var titleEl = document.querySelector('[data-blog-title]');
  var descEl = document.querySelector('[data-blog-description]');
  if (!filterWrap || cards.length === 0) return;

  function setActive(btn) {
    var buttons = filterWrap.querySelectorAll('[data-hub]');
    buttons.forEach(function (button) {
      button.classList.toggle('is-active', button === btn);
    });
  }

  function applyFilter(hub) {
    cards.forEach(function (card) {
      var hubs = (card.getAttribute('data-hubs') || '').split(/\s+/).filter(Boolean);
      var matches = hub === 'all' || hubs.indexOf(hub) !== -1;
      card.classList.toggle('is-hidden', !matches);
    });
  }

  function applyHeader(btn) {
    if (!titleEl || !descEl || !btn) return;
    var title = btn.getAttribute('data-hub-title') || 'Последние публикации по всем хабам';
    var desc = btn.getAttribute('data-hub-description') || 'Выберите хаб, чтобы отфильтровать статьи.';
    titleEl.textContent = title;
    descEl.textContent = desc;
    descEl.style.display = '';
  }

  filterWrap.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.hasAttribute('data-hub')) return;
    var hub = target.getAttribute('data-hub');
    setActive(target);
    applyFilter(hub);
    applyHeader(target);
  });
})();


  var navPanel = document.querySelector('[data-nav-panel]');
  var navOpen = document.querySelector('[data-nav-open]');
  var navCloseBtns = document.querySelectorAll('[data-nav-close]');
  var header = document.querySelector('.site-header');

  function lockBodyScroll() {
    document.body.classList.add('nav-open');
  }

  function unlockBodyScroll() {
    document.body.classList.remove('nav-open');
  }

  function openNav() {
    if (!navPanel) return;
    navPanel.classList.add('is-open');
    navPanel.setAttribute('aria-hidden', 'false');
    lockBodyScroll();
    if (navOpen) {
      navOpen.classList.add('is-open');
      navOpen.setAttribute('aria-label', 'Закрыть навигацию');
    }
  }

  function closeNav() {
    if (!navPanel) return;
    navPanel.classList.remove('is-open');
    navPanel.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
    if (navOpen) {
      navOpen.classList.remove('is-open');
      navOpen.setAttribute('aria-label', 'Открыть навигацию');
    }
  }

  function toggleNav() {
    if (!navPanel) return;
    if (navPanel.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  if (navOpen) {
    navOpen.addEventListener('click', toggleNav);
  }
  navCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeNav);
  });

  if (header) {
    header.addEventListener('click', function (event) {
      var target = event.target;
      if (!target) return;
      var button = target.closest('a, button');
      if (!button) return;
      if (button.hasAttribute('data-nav-open')) return;
      closeNav();
    });
  }

  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }

  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
