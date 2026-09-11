/* Ассистент сайта.
 *
 * Три правила, из которых следует всё остальное:
 *
 * 1. Ничего не выводится в HTML страницы — виджет целиком создаётся здесь.
 *    Робот видит документ ровно таким, каким он был без чата.
 * 2. Бэкенд не ответил по любой причине — виджета нет. Не кнопка с ошибкой,
 *    не «сервис недоступен», а тишина: посетитель не должен знать, что тут
 *    что-то предполагалось.
 * 3. Проверка бэкенда откладывается до простоя браузера, а стили
 *    вставляются только вместе с виджетом, поэтому на загрузку страницы
 *    это не влияет.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var endpoint = (script && script.dataset.endpoint) || '';
  if (!endpoint) return;
  endpoint = endpoint.replace(/\/+$/, '');

  var MAX_LEN = 1000;
  var FALLBACK = 'Не получилось ответить. Напишите в [Telegram](https://t.me/cookiespooky).';
  var HOW_TEXT =
    'Я отвечаю только по этому сайту, а не по интернету. При каждой сборке сайт режется ' +
    'на разделы, и на ваш вопрос подбираются подходящие куски — отвечаю по ним и даю ссылку ' +
    'на конкретный раздел, а не на страницу целиком.\n\n' +
    'Отсюда две вещи, к которым обычно не привыкли: если ответа на сайте нет, я так и скажу, ' +
    'а не переведу разговор на соседнюю тему. И цену не назову — её здесь нет намеренно, ' +
    'объём работы выясняется в разговоре.\n\n' +
    'Как это устроено внутри — [в разборе устройства сайта](/kak-ustroen-etot-sayt/#assistent-kotoryi-otvechaet-po-saitu). ' +
    'Почему «память» в таких штуках это три разные вещи — [отдельная статья](/blog/pamyat-v-chat-bote/).';


  /* Готовый ответ печатается, а не появляется целиком: иначе он выглядит
     подставленным, а всё остальное в чате приходит потоком. Скорость взята
     с реальных ответов модели — около 800 знаков в секунду, то есть примерно
     тринадцать знаков на кадр. Незакрытая markdown-ссылка по дороге видна как
     текст ровно так же, как при настоящем стриме: модель отдаёт её частями. */
  function typeOut(node, text, done) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { withLinks(node, text); if (done) done(); return; }

    var i = 0;
    var step = 13;
    (function frame() {
      i = Math.min(i + step, text.length);
      withLinks(node, text.slice(0, i));
      if (node.parentNode) node.parentNode.scrollTop = node.parentNode.scrollHeight;
      if (i < text.length) requestAnimationFrame(frame);
      else if (done) done();
    })();
  }
  var history = [];
  var busy = false;
  var els = {};

  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 1200); };

  idle(function () {
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, 4000);
    fetch(endpoint + '/api/assistant/health', { signal: ctl.signal })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (s) { if (s && s.ready) mount(); })
      .catch(function () { /* тишина — это и есть предусмотренное поведение */ })
      .finally(function () { clearTimeout(timer); });
  });

  function css() {
    return '' +
    '.npchat{--npchat-live:#22c55e;position:fixed;right:20px;bottom:20px;z-index:80;font:14px/1.5 var(--font,system-ui)}' +
    '.npchat__btn{display:flex;align-items:center;gap:8px;padding:11px 16px;border:1px solid var(--line);' +
      'border-radius:999px;background:var(--paper);color:var(--ink);cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.10);' +
      'font:inherit;transition:border-color .2s var(--ease,ease),transform .2s var(--ease,ease)}' +
    '.npchat__btn:hover{border-color:var(--line-strong);transform:translateY(-1px)}' +
    // Точка живая: зелёный «на связи» плюс два расходящихся круга со сдвигом
    // по фазе. Круги — псевдоэлементы, отдельной разметки не требуют.
    '.npchat__dot{position:relative;width:7px;height:7px;border-radius:50%;background:var(--npchat-live);flex:none}' +
    '.npchat__dot::before,.npchat__dot::after{content:"";position:absolute;inset:0;border-radius:50%;' +
      'background:var(--npchat-live);animation:npchat-ripple 2.8s ease-out infinite}' +
    '.npchat__dot::after{animation-delay:1.4s}' +
    '@keyframes npchat-ripple{0%{transform:scale(1);opacity:.5}70%{opacity:0}100%{transform:scale(3.4);opacity:0}}' +
    '.npchat__panel{display:none;flex-direction:column;width:min(400px,calc(100vw - 40px));height:min(560px,calc(100vh - 120px));' +
      'background:var(--paper);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.16);' +
      'opacity:0;transform:translateY(10px) scale(.98);transform-origin:100% 100%;' +
      'transition:opacity .18s var(--ease,ease),transform .18s var(--ease,ease)}' +
    '.npchat--open .npchat__panel{display:flex}' +
    '.npchat__panel--in{opacity:1;transform:none}' +
    '.npchat--open .npchat__btn{display:none}' +
    '.npchat__head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line)}' +
    '.npchat__title{font-weight:600}' +
    '.npchat__how{display:inline;padding:0;border:0;background:none;font:inherit;color:var(--muted);' +
      'font-size:12px;margin-top:2px;cursor:pointer;text-decoration:underline;text-underline-offset:2px;' +
      'text-decoration-color:var(--line-strong)}' +
    '.npchat__how:hover{color:var(--ink)}' +
    '.npchat__close{border:0;background:none;color:var(--muted);cursor:pointer;font-size:20px;line-height:1;padding:4px 6px}' +
    '.npchat__close:hover{color:var(--ink)}' +
    '.npchat__log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:14px;display:flex;flex-direction:column;gap:12px}' +
    '.npchat__msg{max-width:92%;white-space:pre-wrap;word-wrap:break-word}' +
    '.npchat__msg--me{align-self:flex-end;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:8px 11px}' +
    '.npchat__msg a{color:var(--accent)}' +
    '.npchat__src{font-size:12px;color:var(--muted);display:flex;flex-direction:column;gap:2px;margin-top:2px}' +
    '.npchat__src a{color:var(--muted)}' +
    '.npchat__form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line)}' +
    '.npchat__input{flex:1;resize:none;max-height:120px;padding:9px 11px;border:1px solid var(--line);border-radius:10px;' +
      'background:var(--paper);color:var(--ink);font:inherit}' +
    '.npchat__input:focus{outline:none;border-color:var(--line-strong)}' +
    '.npchat__send{border:1px solid var(--line);border-radius:10px;background:var(--ink);color:var(--paper);' +
      'padding:0 14px;cursor:pointer;font:inherit}' +
    '.npchat__send[disabled]{opacity:.45;cursor:default}' +
    // Индикатор печати живёт до первого куска ответа.
    '.npchat__typing{display:inline-flex;align-items:center;gap:5px;height:20px}' +
    '.npchat__typing i{width:6px;height:6px;border-radius:50%;background:var(--muted);' +
      'animation:npchat-typing 1.2s ease-in-out infinite}' +
    '.npchat__typing i:nth-child(2){animation-delay:.15s}' +
    '.npchat__typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes npchat-typing{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}' +
    // На узком экране панель занимает всю ширину контейнера. Раньше она была
    // на 8px уже него, и разница уходила вправо — отступы выглядели разными.
    // На узком экране панель прибивается к обоим краям сама, а не наследует
    // ширину контейнера: так отступы слева и справа симметричны по построению.
    '@media (max-width:520px){.npchat{right:12px;bottom:12px;left:12px}' +
      '.npchat__btn{width:100%;justify-content:center}' +
      // На телефоне панель — весь экран за вычетом тех же 12px по краям.
      '.npchat__panel{position:fixed;left:12px;right:12px;top:12px;bottom:12px;width:auto;' +
        'height:auto;transform-origin:50% 100%}' +
      // Размер и место панели считает fit() по visualViewport: fixed-элементы
      // привязаны к layout viewport, который клавиатура на iOS не уменьшает,
      // так что без этого нижний край панели вместе с полем ввода уходит под неё.
      '.npchat--fit .npchat__panel{bottom:auto;top:var(--npchat-top);height:var(--npchat-h)}}' +
    // iOS увеличивает страницу при фокусе на поле со шрифтом мельче 16px.
    // pointer:coarse — чтобы накрыть и iPad, у которого экран шире 520px.
    '@media (max-width:520px),(pointer:coarse){.npchat__input{font-size:16px}}' +
    '@media (prefers-reduced-motion:reduce){.npchat__btn,.npchat__panel{transition:none}' +
      '.npchat__dot::before,.npchat__dot::after,.npchat__typing i{animation:none}' +
      '.npchat__dot::before,.npchat__dot::after{opacity:0}}';
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function mount() {
    var style = el('style');
    style.textContent = css();
    document.head.appendChild(style);

    var root = el('div', 'npchat');
    var btn = el('button', 'npchat__btn');
    btn.type = 'button';
    btn.appendChild(el('span', 'npchat__dot'));
    btn.appendChild(el('span', null, 'AI-поддержка'));

    var panel = el('div', 'npchat__panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Ассистент сайта');

    var head = el('div', 'npchat__head');
    var heading = el('div');
    heading.appendChild(el('div', 'npchat__title', 'Ассистент сайта'));

    // Ссылка остаётся на месте: нажать можно сколько угодно раз.
    var how = el('button', 'npchat__how', 'Как это работает?');
    how.type = 'button';
    heading.appendChild(how);
    var close = el('button', 'npchat__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Закрыть');
    head.appendChild(heading);
    head.appendChild(close);

    var log = el('div', 'npchat__log');
    log.setAttribute('aria-live', 'polite');

    var form = el('form', 'npchat__form');
    var input = el('textarea', 'npchat__input');
    input.rows = 1;
    input.maxLength = MAX_LEN;
    input.placeholder = 'Например: что такое разбор?';
    input.setAttribute('aria-label', 'Вопрос');
    var send = el('button', 'npchat__send', '→');
    send.type = 'submit';
    form.appendChild(input);
    form.appendChild(send);

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(form);
    root.appendChild(btn);
    root.appendChild(panel);
    document.body.appendChild(root);

    els = { root: root, log: log, input: input, send: send };

    // Блокировка прокрутки на телефоне. overflow:hidden на body iOS не
    // соблюдает, поэтому body фиксируется со сдвигом на текущую прокрутку,
    // а при закрытии прокрутка возвращается на место. Плавную прокрутку
    // из base.css на это время выключаем, иначе страница проедет от верха.
    var mobile = window.matchMedia('(max-width:520px)');
    var lockedY = null;
    var bodyCss = '';

    function lock() {
      if (lockedY !== null) return;
      lockedY = window.scrollY;
      bodyCss = document.body.style.cssText;
      document.body.style.cssText = bodyCss +
        ';position:fixed;top:' + (-lockedY) + 'px;left:0;right:0;width:100%;overflow:hidden';
    }

    function unlock() {
      if (lockedY === null) return;
      var y = lockedY;
      lockedY = null;
      document.body.style.cssText = bodyCss;
      var html = document.documentElement;
      var behavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      html.style.scrollBehavior = behavior;
    }

    // Панель занимает видимую часть экрана целиком: шапка сверху, поле ввода
    // прямо над клавиатурой. Размер зависит только от visualViewport, а не от
    // фокуса поля: фокус теряется при нажатии на «→», и панель, прыгнув в этот
    // момент, увела бы кнопку из-под пальца.
    var vv = window.visualViewport;

    function fit() {
      if (!vv || !mobile.matches || !root.classList.contains('npchat--open')) {
        root.classList.remove('npchat--fit');
        return;
      }
      var h = vv.height - 24;
      var atBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 24;
      root.style.setProperty('--npchat-h', h + 'px');
      root.style.setProperty('--npchat-top', (vv.offsetTop + 12) + 'px');
      root.classList.add('npchat--fit');
      if (atBottom) log.scrollTop = log.scrollHeight;
    }

    if (vv) {
      vv.addEventListener('resize', fit);
      vv.addEventListener('scroll', fit);
    }
    function onMobileChange() {
      if (!root.classList.contains('npchat--open')) return;
      if (mobile.matches) lock(); else unlock();
      fit();
    }
    if (mobile.addEventListener) mobile.addEventListener('change', onMobileChange);
    else if (mobile.addListener) mobile.addListener(onMobileChange);

    // display нельзя анимировать, поэтому порядок такой: сначала показать
    // панель, следующим кадром — включить класс перехода. При закрытии
    // наоборот: снять класс, дождаться конца перехода и убрать из потока.
    var closeTimer = null;

    function open() {
      clearTimeout(closeTimer);
      root.classList.add('npchat--open');
      if (mobile.matches) lock();
      fit();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { panel.classList.add('npchat__panel--in'); });
      });
      // preventScroll: без него iOS подтягивает поле в вид, сдвигая страницу.
      input.focus({ preventScroll: true });
      if (!log.childNodes.length) {
        say('assistant', 'Спрашивайте про услуги, кейсы и статьи — отвечу по тому, что есть на сайте, и дам ссылку. Чего на сайте нет, так и скажу.');
      }
    }

    function hide() {
      if (!root.classList.contains('npchat--open')) return;
      panel.classList.remove('npchat__panel--in');
      input.blur();
      unlock();
      closeTimer = setTimeout(function () { root.classList.remove('npchat--open', 'npchat--fit'); }, 180);
    }

    function explain() {
      // Пока печатается предыдущий ответ — не начинаем второй поверх него.
      if (busy) return;
      open();
      say('user', 'Как это работает?');

      // Та же последовательность, что и у настоящего ответа: сначала точки,
      // потом печать. Пауза короткая — ответ готов, ждать нечего.
      var bubble = say('assistant', '');
      var dots = typingDots();
      bubble.appendChild(dots);
      log.scrollTop = log.scrollHeight;

      busy = true;
      els.send.disabled = true;
      setTimeout(function () {
        typeOut(bubble, HOW_TEXT, function () {
          busy = false;
          els.send.disabled = false;
        });
      }, 260);
    }

    how.addEventListener('click', explain);
    btn.addEventListener('click', open);
    // Ссылка вида /services/razbor/#chat открывает чат сразу: удобно вести
    // на него из письма или из соседнего проекта.
    if (location.hash === '#chat') open();
    close.addEventListener('click', hide);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hide();
    });

    // Клик мимо окна закрывает его. Слушаем pointerdown, а не click:
    // если выделять текст внутри панели и отпустить кнопку снаружи, click
    // придёт уже на общего предка — то есть на документ — и панель закрылась
    // бы посреди выделения. Нажатие же начинается внутри, и это видно.
    // Кнопка запуска лежит внутри root, поэтому открывающий клик сюда не
    // попадает и панель не схлопывается сразу после открытия.
    document.addEventListener('pointerdown', function (e) {
      if (!root.classList.contains('npchat--open')) return;
      if (root.contains(e.target)) return;
      hide();
    });

    // Ссылка из ответа при заблокированной странице: переход по якорю на ней
    // же ничего бы не прокрутил. Закрываем чат до действия по умолчанию —
    // прокрутка к этому моменту уже возвращена, и якорь срабатывает.
    log.addEventListener('click', function (e) {
      if (lockedY !== null && e.target.closest && e.target.closest('a')) hide();
    });

    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); ask(); });
  }

  function typingDots() {
    var t = el('span', 'npchat__typing');
    t.setAttribute('aria-label', 'Ассистент печатает');
    t.appendChild(el('i'));
    t.appendChild(el('i'));
    t.appendChild(el('i'));
    return t;
  }

  function say(role, text) {
    var node = el('div', 'npchat__msg npchat__msg--' + (role === 'user' ? 'me' : 'bot'));
    node.textContent = text;
    els.log.appendChild(node);
    els.log.scrollTop = els.log.scrollHeight;
    return node;
  }

  /* Ответ приходит текстом с markdown-ссылками. Полноценный парсер здесь
     не нужен и опасен: превращаем только ссылки, всё остальное остаётся
     текстом через textContent, поэтому вставить разметку через ответ нельзя. */
  function withLinks(node, text) {
    node.textContent = '';
    var re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = el('a', null, m[1]);
      a.href = m[2];
      a.target = '_blank';
      a.rel = 'noopener';
      node.appendChild(a);
      last = m.index + m[0].length;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
  }

  function ask() {
    if (busy) return;
    var q = els.input.value.trim();
    if (!q) return;

    busy = true;
    els.send.disabled = true;
    els.input.value = '';
    els.input.style.height = 'auto';
    say('user', q);
    history.push({ role: 'user', content: q });

    var bubble = say('assistant', '');
    bubble.appendChild(typingDots());
    var answer = '';
    var sources = [];

    fetch(endpoint + '/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-6), page: location.href.split('#')[0] })
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('http ' + res.status);
      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buf = '';
      var event = null;

      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          buf += decoder.decode(r.value, { stream: true });
          var lines = buf.split('\n');
          buf = lines.pop();
          lines.forEach(function (line) {
            if (line.indexOf('event: ') === 0) { event = line.slice(7); return; }
            if (line.indexOf('data: ') !== 0) return;
            var data;
            try { data = JSON.parse(line.slice(6)); } catch (e) { return; }
            if (event === 'delta') {
              answer += data;
              withLinks(bubble, answer); // заодно вычищает индикатор печати
              els.log.scrollTop = els.log.scrollHeight;
            } else if (event === 'sources') {
              sources = data;
            } else if (event === 'error') {
              throw new Error('upstream');
            }
          });
          return pump();
        });
      })();
    }).then(function () {
      if (!answer) { withLinks(bubble, FALLBACK); return; }
      history.push({ role: 'assistant', content: answer });
      if (sources.length) {
        var box = el('div', 'npchat__src');
        var seen = {};
        sources.forEach(function (s) {
          if (seen[s.url]) return;
          seen[s.url] = 1;
          var a = el('a', null, s.heading ? s.page_title + ' — ' + s.heading : s.page_title);
          a.href = s.url;
          a.target = '_blank';
          a.rel = 'noopener';
          box.appendChild(a);
        });
        els.log.appendChild(box);
      }
    }).catch(function () {
      // Уже пришедший текст не стираем: обрыв посреди ответа случается, и
      // терять половину объяснения вместе со связью — обиднее, чем увидеть
      // приписку о том, что продолжения не будет.
      if (answer) {
        withLinks(bubble, answer + '\n\n— связь прервалась на середине. Дописать это можно в [Telegram](https://t.me/cookiespooky).');
      } else {
        withLinks(bubble, 'Связь с ассистентом прервалась. Напишите в [Telegram](https://t.me/cookiespooky).');
      }
    }).finally(function () {
      busy = false;
      els.send.disabled = false;
      els.log.scrollTop = els.log.scrollHeight;
    });
  }
})();
