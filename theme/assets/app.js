// Боковое меню и фильтр кейсов. Без JS страница остаётся полностью рабочей.
(function () {
  // ---------- боковое меню ----------
  var drawer = document.querySelector('[data-drawer]');
  var overlay = document.querySelector('[data-drawer-overlay]');
  var openBtn = document.querySelector('[data-drawer-open]');
  var closeBtn = document.querySelector('[data-drawer-close]');

  if (drawer && overlay && openBtn) {
    var open = function () {
      drawer.hidden = false;
      overlay.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
      });
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    };
    var close = function () {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () {
        if (!drawer.classList.contains('is-open')) {
          drawer.hidden = true;
          overlay.hidden = true;
        }
      }, 280);
      openBtn.focus();
    };

    openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && drawer.classList.contains('is-open')) close();
    });
  }

  // ---------- фильтр кейсов ----------
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  if (!filters.length) return;
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
  var strip = document.querySelector('.filters');
  var bar = document.querySelector('.filters-bar');
  var empty = document.querySelector('[data-catalog-empty]');
  var mode = 'all';        // выбранный фильтр
  var marked = 'all';      // подсвеченная кнопка

  // мягкие края ленты фильтров: показываем только там, где табы уезжают за край
  var edgeTick = false;
  function updateEdges() {
    edgeTick = false;
    if (!strip) return;
    var max = strip.scrollWidth - strip.clientWidth;
    if (max < 4) { strip.removeAttribute('data-edge'); return; }
    var left = strip.scrollLeft > 4;
    var right = strip.scrollLeft < max - 4;
    strip.setAttribute('data-edge', left && right ? 'both' : left ? 'left' : right ? 'right' : 'none');
  }
  function queueEdges() {
    if (edgeTick) return;
    edgeTick = true;
    requestAnimationFrame(updateEdges);
  }
  if (strip) {
    strip.addEventListener('scroll', queueEdges, { passive: true });
    window.addEventListener('resize', queueEdges);
    updateEdges();
    window.setTimeout(updateEdges, 300);
  }

  // позиция элемента в документе: у прилипшего блока getBoundingClientRect
  // возвращает координату «приклеенного» состояния, а не его место в потоке
  function docTop(el) {
    var y = 0;
    while (el) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  function byKey(key) {
    for (var i = 0; i < filters.length; i += 1) {
      if (filters[i].getAttribute('data-filter') === key) return filters[i];
    }
    return null;
  }

  // подсветка кнопки + подтягивание ленты фильтров к левому краю
  function mark(key, scrollStrip) {
    if (marked === key) return;
    marked = key;
    filters.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === key));
    });
    if (!scrollStrip || !strip) return;
    var btn = byKey(key);
    if (!btn) return;
    var pad = parseFloat(getComputedStyle(strip).paddingLeft) || 12;
    var left = btn.offsetLeft;
    var right = left + btn.offsetWidth;
    var viewLeft = strip.scrollLeft;
    var viewRight = viewLeft + strip.clientWidth;
    var target = null;
    if (key === 'all') target = 0;
    else if (left - pad < viewLeft || right + pad > viewRight) target = left - pad;
    if (target === null) return;
    target = Math.max(0, target);
    if (Math.abs(strip.scrollLeft - target) < 6) return;
    try {
      strip.scrollTo({ left: target, behavior: 'smooth' });
    } catch (e) {
      strip.scrollLeft = target;
    }
    window.setTimeout(updateEdges, 420);
  }

  function apply(value, scrollToBar) {
    mode = value;
    var visible = 0;
    groups.forEach(function (group) {
      var match = value === 'all' || group.getAttribute('data-group') === value;
      group.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
    // содержимое открытой группы показываем сразу: это ответ на действие пользователя
    groups.forEach(function (group) {
      if (group.hidden) return;
      if (group.classList.contains('reveal')) group.classList.add('is-visible');
      var inner = group.querySelectorAll('.reveal');
      Array.prototype.forEach.call(inner, function (el) { el.classList.add('is-visible'); });
    });
    marked = null;
    mark(value, true);
    try {
      history.replaceState(null, '', value === 'all' ? '#cases' : '#' + value);
    } catch (e) {}
    if (scrollToBar && bar) {
      var headerEl = document.querySelector('.site-header');
      var headerH = headerEl ? headerEl.getBoundingClientRect().height : 74;
      var top = Math.max(0, docTop(bar) - headerH);
      if (Math.abs(window.scrollY - top) > 4) {
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('data-filter'), true);
    });
  });

  // ---------- подсветка раздела при прокрутке ----------
  function currentGroup() {
    if (!bar) return null;
    var barBox = bar.getBoundingClientRect();
    var headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
    // пока панель фильтров не прилипла к шапке, раздел не подсвечиваем
    if (barBox.top > headerH + 2) return 'all';
    var line = barBox.bottom + 24;
    var found = null;
    groups.forEach(function (group) {
      if (group.hidden) return;
      var box = group.getBoundingClientRect();
      if (box.top <= line && box.bottom > line) found = group.getAttribute('data-group');
    });
    if (found) return found;
    var first = groups[0].getBoundingClientRect();
    if (first.top > line) return 'all';
    var last = groups[groups.length - 1].getBoundingClientRect();
    if (last.bottom <= line) return groups[groups.length - 1].getAttribute('data-group');
    return null;
  }

  var lastRun = 0;
  function spy() {
    if (mode !== 'all') return;
    var key = currentGroup();
    if (key) mark(key, true);
  }
  function onScroll() {
    var now = Date.now();
    if (now - lastRun < 120) return;
    lastRun = now;
    spy();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', spy);

  // основной механизм: наблюдатель пересечений — работает и при программной прокрутке
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function () { spy(); }, {
      threshold: [0, 0.02, 0.2, 0.5, 0.98, 1]
    });
    groups.forEach(function (group) { io.observe(group); });
  }

  // ---------- мягкое появление блоков ----------
  (function reveal() {
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-ready');
    var selector = '.hero, .cases .section-head, .catalog-group, .process li, .stack, .cta,'
      + ' .page-hero, .meta, .shot, .facts, .case-body, .related, .mini-list';
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;
    nodes.forEach(function (n) { n.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    nodes.forEach(function (n) { io.observe(n); });
    // всё, что уже в кадре при загрузке, показываем сразу
    window.setTimeout(function () {
      nodes.forEach(function (n) {
        var box = n.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) n.classList.add('is-visible');
      });
    }, 60);
  })();

  var hash = (location.hash || '').replace('#', '');
  var known = filters.some(function (b) { return b.getAttribute('data-filter') === hash; });
  if (known && hash !== 'all') apply(hash, false);
  else spy();
})();
