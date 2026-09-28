// Интерфейс теста с вынужденным выбором.
//
// Во время проб на экране не должно быть ничего, кроме двух образцов: ни HEX,
// ни отношений, ни растра. Иначе испытуемый ответит по подсказке, а не по слуху,
// и условие «контроль» это поймает — но лучше не создавать утечку вовсе.

import { renderEvents } from '../audio/audioEngine.js';
import { chordFromColor, chordEvents, toHex } from './colorSound.js';
import { buildBlock, binomTest, thresholdFor, CONDITION_INFO } from './forcedChoice.js';

const $ = (id) => document.getElementById(id);
const SR = 48000;
const DUR = 2.5;
const BASE = 880;

const fc = {
  running: false, trials: [], i: 0, answers: [], seed: 0,
  ctx: null, source: null, cache: new Map(), shownAt: 0, feedback: false,
};

// Приведение октавами здесь выключено намеренно: оно схлопнуло бы регистр,
// а вместе с ним и всё условие «яркость».
const chordOf = (rgb) => chordFromColor({ rgb, base: BASE, tuning: 'just', fold: false });

async function renderTrial(idx) {
  if (idx >= fc.trials.length || fc.cache.has(idx)) return;
  const t = fc.trials[idx];
  const rgb = t.target === 'left' ? t.left : t.right;
  const samples = await renderEvents(chordEvents(chordOf(rgb), DUR), DUR, {
    sampleRate: SR, method: 'pinpulse', dither: 'error',
    gain: 0.5, pulseDensity: 1, modulePath: './src/audio/oneBitProcessor.js',
  });
  fc.cache.set(idx, samples);
}

async function playTrial() {
  stopAudio();
  if (!fc.cache.has(fc.i)) { $('fcHint').textContent = 'готовлю звук…'; await renderTrial(fc.i); }
  $('fcHint').textContent = '';
  if (!fc.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    fc.ctx = new C({ sampleRate: SR });
  }
  if (fc.ctx.state === 'suspended') await fc.ctx.resume();
  const samples = fc.cache.get(fc.i);
  const buf = fc.ctx.createBuffer(1, samples.length, SR);
  buf.copyToChannel(samples, 0);
  const src = fc.ctx.createBufferSource();
  src.buffer = buf;
  src.connect(fc.ctx.destination);
  src.start();
  fc.source = src;
}

function stopAudio() { if (fc.source) { try { fc.source.stop(); } catch {} fc.source = null; } }

async function showTrial() {
  const t = fc.trials[fc.i];
  // Пока звук не готов, ответы принимать нельзя, и это должно быть видно:
  // молча проглоченный клик выглядит как зависший интерфейс.
  $('fcTrial').dataset.ready = '0';
  $('fcProgress').textContent = `проба ${fc.i + 1} / ${fc.trials.length}`;
  $('fcBar').style.width = (100 * fc.i / fc.trials.length) + '%';
  $('fcLeft').style.background = toHex(t.left);
  $('fcRight').style.background = toHex(t.right);
  $('fcLeft').classList.remove('right', 'wrong');
  $('fcRight').classList.remove('right', 'wrong');
  await playTrial();
  fc.shownAt = performance.now();
  $('fcTrial').dataset.ready = '1';
  renderTrial(fc.i + 1);          // готовим следующую пробу заранее
}

function answer(side) {
  if (!fc.running || fc.shownAt === 0) return;
  const t = fc.trials[fc.i];
  const correct = side === t.target;
  fc.answers.push({ ...t, response: side, correct, ms: Math.round(performance.now() - fc.shownAt) });
  fc.shownAt = 0;
  stopAudio();

  const finish = () => {
    $('fcTrial').dataset.ready = '0';
    fc.i++;
    if (fc.i >= fc.trials.length) showResults();
    else showTrial();
  };

  if (fc.feedback) {
    const el = t.target === 'left' ? $('fcLeft') : $('fcRight');
    const other = t.target === 'left' ? $('fcRight') : $('fcLeft');
    el.classList.add('right'); other.classList.add('wrong');
    setTimeout(finish, 700);
  } else finish();
}

// --- Результаты --------------------------------------------------------

function showResults() {
  fc.running = false;
  stopAudio();
  $('fcTrial').style.display = 'none';
  $('fcResults').style.display = 'block';
  $('fcBar').style.width = '100%';
  $('fcProgress').textContent = `готово · ${fc.trials.length} проб`;

  const rows = [];
  const stats = {};
  for (const cond of ['brightness', 'ratio', 'control']) {
    const set = fc.answers.filter((a) => a.condition === cond);
    const k = set.filter((a) => a.correct).length;
    const r = binomTest(k, set.length);
    const need = thresholdFor(set.length);
    stats[cond] = { k, n: set.length, ...r, need };
    const sig = r.p < 0.05;
    rows.push(`<tr>
      <td>${CONDITION_INFO[cond].name}</td>
      <td>${k} / ${set.length}</td>
      <td>${(100 * r.hitRate).toFixed(0)}%</td>
      <td>${(100 * r.ci[0]).toFixed(0)}–${(100 * r.ci[1]).toFixed(0)}%</td>
      <td class="${sig ? 'hit' : 'dim'}">${r.p < 0.0001 ? '<0.0001' : r.p.toFixed(4)}</td>
      <td class="dim">${need == null ? '—' : need}</td>
      <td class="${sig ? 'hit' : 'dim'}">${sig ? 'выше случайного' : 'на уровне случайного'}</td>
    </tr>`);
  }
  $('fcTable').innerHTML = rows.join('');

  // Вывод читается сверху вниз: сначала контроль, потом всё остальное.
  // Если контроль выше случайного — где-то утечка, и остальные цифры
  // обсуждать бессмысленно.
  const out = [];
  if (stats.control.p < 0.05) {
    out.push(['bad', 'КОНТРОЛЬ ВЫШЕ СЛУЧАЙНОГО',
      'частоты в этих пробах идентичны, различить их нельзя. Значит есть утечка — ' +
      'визуальная подсказка, порядковое смещение или ошибка. Остальные результаты недействительны.']);
  } else {
    out.push(['ok', 'контроль чист',
      'на пробах с идентичными частотами результат случайный — утечки нет, процедуре можно верить.']);
    if (stats.brightness.p < 0.05) {
      out.push(['ok', 'яркость различается',
        'регистр слышен и связывается со светлотой. Это известное межмодальное соответствие, ' +
        'и его воспроизведение показывает, что процедура способна поймать реальный эффект.']);
    } else {
      out.push(['warn', 'яркость НЕ различается',
        'даже известное соответствие не поймано. Скорее всего мало проб или условия прослушивания ' +
        'плохие — тогда и нулевой результат по отношениям ничего не доказывает.']);
    }
    if (stats.ratio.p < 0.05) {
      out.push(['ok', 'ОТНОШЕНИЯ РАЗЛИЧАЮТСЯ — неожиданно',
        'при выровненном регистре испытуемый угадывает цвет по интервалам. Это против моего прогноза. ' +
        'Прежде чем радоваться: проверить, что средние яркости действительно совпали, и повторить с другим сидом.']);
    } else {
      out.push(['ok', 'отношения не различаются',
        'при выровненном регистре результат случайный. Гипотеза «оттенок соответствует аккорду» ' +
        'не подтверждается: работает только ось яркость → регистр, а она была известна и без нас.']);
    }
  }
  $('fcVerdict').innerHTML = out.map(([cls, head, body]) =>
    `<div class="fcv ${cls}"><b>${head}</b><span>${body}</span></div>`).join('');

  const power = thresholdFor(stats.ratio.n);
  $('fcPower').textContent =
    `Мощность: при ${stats.ratio.n} пробах на условие отвергнуть случайность можно начиная с ${power} попаданий ` +
    `(${(100 * power / stats.ratio.n).toFixed(0)}%). То есть тест видит только крупный эффект. ` +
    `Отсутствие результата означает «большого эффекта нет», а не «эффекта нет вовсе».`;

  fc.summary = { seed: fc.seed, perCondition: stats.ratio.n, feedback: fc.feedback, stats };
}

function exportResults() {
  const data = { ...fc.summary, base: BASE, sampleRate: SR, duration: DUR, trials: fc.answers };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `forced-choice_seed${fc.seed}_n${fc.answers.length}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- Запуск ------------------------------------------------------------

async function start() {
  fc.seed = Number($('fcSeed').value) || Math.floor(Math.random() * 1e6);
  $('fcSeed').value = fc.seed;
  fc.feedback = $('fcFeedback').checked;
  // Значение из select может оказаться пустым, если его выставили извне —
  // тогда блок собрался бы пустым и первая же проба упала бы.
  const per = Math.max(4, Math.min(200, Number($('fcPer').value) || 20));
  fc.trials = buildBlock(fc.seed, per);
  fc.answers = []; fc.i = 0; fc.cache.clear(); fc.running = true;
  $('fcSetup').style.display = 'none';
  $('fcResults').style.display = 'none';
  $('fcTrial').style.display = 'block';
  await showTrial();
}

export function initForcedChoice() {
  $('fcOpen').addEventListener('click', () => {
    $('lab').style.display = 'none';
    $('test').style.display = 'block';
    $('fcSetup').style.display = 'block';
    $('fcTrial').style.display = 'none';
    $('fcResults').style.display = 'none';
    $('fcSeed').value = Math.floor(Math.random() * 1e6);
  });
  $('fcClose').addEventListener('click', () => {
    fc.running = false; stopAudio();
    $('test').style.display = 'none';
    $('lab').style.display = 'block';
  });
  $('fcStart').addEventListener('click', start);
  $('fcAgain').addEventListener('click', () => {
    $('fcSeed').value = Math.floor(Math.random() * 1e6);
    $('fcResults').style.display = 'none';
    $('fcSetup').style.display = 'block';
  });
  $('fcExport').addEventListener('click', exportResults);
  $('fcReplay').addEventListener('click', playTrial);
  $('fcLeft').addEventListener('click', () => answer('left'));
  $('fcRight').addEventListener('click', () => answer('right'));

  document.addEventListener('keydown', (e) => {
    if (!fc.running || $('test').style.display === 'none') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); answer('left'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); answer('right'); }
    if (e.code === 'Space') { e.preventDefault(); playTrial(); }
  });

  const info = Object.entries(CONDITION_INFO)
    .map(([, v]) => `<div class="kv"><span>${v.name}</span><b>${v.hint}</b></div>`).join('');
  $('fcConditions').innerHTML = info;
}
