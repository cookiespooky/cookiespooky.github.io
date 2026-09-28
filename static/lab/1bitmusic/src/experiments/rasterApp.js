// Сборка растрового эксперимента. Правило: между битом и пикселем нет
// ни одного преобразования. Никакого сглаживания, интерполяции, контраста.

import { renderEvents, extractBits, packBits } from '../audio/audioEngine.js';
import {
  SIGNALS, buildTones, buildEvents, bitPeriodSamples, combinedBitPeriod,
  ditherPeriodPulses, rowsToRepeat, driftOf, measuredRepeat, bitsToImageData,
  pngWithMetadata,
} from './rasterLab.js';

const $ = (id) => document.getElementById(id);
const SR = 48000;
const TEST_BASE_WIDTH = 7;      // ширина импульса у голоса kind:'test' в процессоре

const state = {
  signal: 'triad', tuning: 'just', method: 'pinpulse', dither: 'error',
  width: 1200, seconds: 30, zoom: 1, pulseWidth: 7, compare: true,
  passes: [], ctx: null, source: null, playingIdx: -1, startedAt: 0,
};

const msg = (t) => { $('msg').textContent = t; };
const num = (n) => n.toLocaleString('ru');

// --- Рендер -----------------------------------------------------------

async function render() {
  $('render').disabled = true;
  msg('рендер…');
  try {
    const t0 = performance.now();
    stop();
    const tunings = state.compare ? ['just', 'tet'] : [state.tuning];
    const passes = [];
    for (const tuning of tunings) {
      const tones = buildTones({ signal: state.signal, tuning });
      const samples = await renderEvents(buildEvents(tones, state.seconds), state.seconds, {
        sampleRate: SR, method: state.method, dither: state.dither,
        gain: 0.6, pulseDensity: state.pulseWidth / TEST_BASE_WIDTH,
        modulePath: './src/audio/oneBitProcessor.js',
      });
      const info = extractBits(samples);
      passes.push({
        tuning, label: tuning === 'just' ? 'JUST' : '12-TET',
        tones, samples, bits: info.bits, levels: info.distinctLevels, rows: 0,
      });
    }
    state.passes = passes;
    layout();
    msg(`готово за ${Math.round(performance.now() - t0)} мс`);
  } catch (e) {
    msg('ОШИБКА: ' + e.message);
    console.error(e);
  }
  $('render').disabled = false;
}

// --- Раскладка --------------------------------------------------------

function layout() {
  const W = state.width;
  for (const p of state.passes) p.rows = Math.floor(p.bits.length / W);
  const rows = state.passes[0].rows;

  const box = $('rasters');
  box.innerHTML = '';
  state.passes.forEach((p, i) => {
    const panel = document.createElement('div');
    panel.className = 'rpanel';
    panel.innerHTML = `<div class="rhead"><b>${p.label}</b>
      <span>${W} × ${p.rows} px · ${num(p.bits.length)} бит · ${(100 * ones(p.bits) / p.bits.length).toFixed(2)}% единиц</span>
      <button data-i="${i}" class="pbtn">▶ PLAY</button></div>
      <div class="view"><canvas></canvas><div class="playhead"></div></div>`;
    box.appendChild(panel);

    const cv = panel.querySelector('canvas');
    cv.width = W; cv.height = p.rows;
    cv.getContext('2d').putImageData(bitsToImageData(p.bits, W, p.rows), 0, 0);
    cv.style.width = W * state.zoom + 'px';
    cv.style.height = p.rows * state.zoom + 'px';

    p.view = panel.querySelector('.view');
    p.playhead = panel.querySelector('.playhead');
    p.button = panel.querySelector('.pbtn');
    p.button.addEventListener('click', () => (state.playingIdx === i ? stop() : play(i)));
    // Прокрутка синхронна: сравнивать имеет смысл только одинаковые участки.
    p.view.addEventListener('scroll', () => {
      if (syncing) return;
      syncing = true;
      for (const q of state.passes) if (q !== p) q.view.scrollTop = p.view.scrollTop;
      $('scrub').value = Math.round(p.view.scrollTop / state.zoom);
      updatePos();
      syncing = false;
    });
  });

  $('scrub').max = Math.max(0, rows - 1);
  $('scrub').value = 0;
  fillNumbers();
  updatePos();
}

let syncing = false;
const ones = (b) => { let n = 0; for (let i = 0; i < b.length; i++) n += b[i]; return n; };

// --- Числа ------------------------------------------------------------

function fillNumbers() {
  const W = state.width;
  const dp = ditherPeriodPulses(state.pulseWidth, state.dither);
  const rows = [];
  for (const p of state.passes) {
    p.tones.forEach((t, i) => {
      const d = driftOf(t.freq, SR, W);
      const N = bitPeriodSamples(t.rational, SR, dp);
      const R = rowsToRepeat(N, W);
      rows.push(`<tr class="${i === 0 ? 'grp' : ''}">
        <td>${i === 0 ? p.label : ''}</td>
        <td>${t.label}</td>
        <td>${t.freq.toFixed(3)}</td>
        <td>${d.period.toFixed(4)}</td>
        <td>${d.mod.toFixed(3)}</td>
        <td class="${Math.abs(d.drift) < 0.5 ? 'hit' : ''}">${d.drift >= 0 ? '+' : ''}${d.drift.toFixed(3)}</td>
        <td>${N == null ? '—' : num(N)}</td>
        <td>${R == null ? '—' : num(R)}</td>
      </tr>`);
    });
  }
  $('tones').innerHTML = rows.join('');

  const out = [];
  for (const p of state.passes) {
    const N = combinedBitPeriod(p.tones, SR, dp);
    const theoryRows = rowsToRepeat(N, W);
    const skip = Math.max(10, Math.round(p.rows * 0.02));
    const windowRows = p.rows - 2 * skip;
    const meas = measuredRepeat(p.bits, W, skip, p.rows - skip);

    let verdict, cls;
    if (N == null) {
      const why = dp == null ? 'случайный дизер' : 'отношения частот иррациональны';
      verdict = meas == null
        ? `сходится: периода нет ни в теории (${why}), ни в битах`
        : `РАСХОЖДЕНИЕ: теория периода не даёт, а биты повторяются через ${num(meas)}`;
      cls = meas == null ? 'ok' : 'bad';
    } else if (theoryRows * 2 > windowRows) {
      // Повтор нельзя подтвердить, если период длиннее половины отрезка —
      // это не расхождение, а нехватка данных.
      verdict = `период ${num(theoryRows)} строк длиннее отрезка анализа (${num(windowRows)}) — не проверяется`;
      cls = 'warn';
    } else {
      verdict = meas === theoryRows ? 'сходится: измерение совпало с теорией'
        : `РАСХОЖДЕНИЕ: теория ${num(theoryRows)}, биты ${meas == null ? 'без периода' : num(meas)}`;
      cls = meas === theoryRows ? 'ok' : 'bad';
    }

    out.push(`<div class="rep">
      <div class="rl">${p.label}</div>
      <div><span>теория</span><b>${N == null
        ? (dp == null ? 'нет — случайный дизер' : 'нет — отношения частот иррациональны')
        : `${num(N)} сэмплов = ${num(theoryRows)} строк`}</b></div>
      <div><span>измерено по битам</span><b>${meas == null ? `не найдено на ${num(windowRows)} строках` : `${num(meas)} строк`}</b></div>
      <div class="${cls}"><span>вывод</span><b>${verdict}</b></div>
      <div><span>значений сэмпла</span><b>${p.levels}</b></div>
    </div>`);
  }
  $('repeat').innerHTML = out.join('');

  const w = state.pulseWidth;
  $('dinfo').innerHTML = dp === 1
    ? `ширина импульса ${w} — целая, дробной части нет: DETERMINISTIC и RANDOM дают <b>один и тот же поток</b>, дизер не участвует`
    : dp == null
      ? `ширина импульса ${w} — дробная, дизер случайный: периода нет <b>по построению</b>, сколько ни жди`
      : `ширина импульса ${w} — дробная, накопитель ошибки циклится через <b>${dp} импульса</b> и во столько же раз удлиняет период узора`;
}

// --- Воспроизведение того же самого массива ---------------------------

async function play(idx) {
  const p = state.passes[idx];
  if (!p) return;
  stop();
  if (!state.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    state.ctx = new C({ sampleRate: SR });
  }
  if (state.ctx.state === 'suspended') await state.ctx.resume();
  if (state.ctx.sampleRate !== SR) {
    msg(`внимание: контекст на ${state.ctx.sampleRate} Гц — поток пересчитывается и на выходе перестаёт быть однобитным`);
  }
  const buf = state.ctx.createBuffer(1, p.samples.length, SR);
  buf.copyToChannel(p.samples, 0);
  const src = state.ctx.createBufferSource();
  src.buffer = buf;
  src.connect(state.ctx.destination);
  src.onended = () => { if (state.source === src) stop(); };
  src.start();
  state.source = src;
  state.playingIdx = idx;
  state.startedAt = state.ctx.currentTime;
  p.button.textContent = '■ STOP';
  p.button.classList.add('on');
  follow();
}

function stop() {
  if (state.source) { try { state.source.stop(); } catch {} state.source = null; }
  state.playingIdx = -1;
  for (const p of state.passes) {
    if (p.button) { p.button.textContent = '▶ PLAY'; p.button.classList.remove('on'); }
    if (p.playhead) p.playhead.style.display = 'none';
  }
}

function follow() {
  if (state.playingIdx < 0) return;
  const p = state.passes[state.playingIdx];
  const row = Math.floor((state.ctx.currentTime - state.startedAt) * SR / state.width);
  if (row >= 0 && row < p.rows) {
    p.playhead.style.display = 'block';
    p.playhead.style.top = row * state.zoom + 'px';
    syncing = true;
    const target = Math.max(0, row * state.zoom - p.view.clientHeight / 2);
    for (const q of state.passes) q.view.scrollTop = target;
    syncing = false;
    $('scrub').value = row;
    updatePos();
  }
  requestAnimationFrame(follow);
}

// --- Скраб ------------------------------------------------------------

function scrubTo(row) {
  if (!state.passes.length) return;
  const r = Math.max(0, Math.min(state.passes[0].rows - 1, row));
  $('scrub').value = r;
  syncing = true;
  for (const p of state.passes) p.view.scrollTop = r * state.zoom;
  syncing = false;
  updatePos();
}

function updatePos() {
  const row = Number($('scrub').value) || 0;
  const sample = row * state.width;
  const total = state.passes.length ? state.passes[0].rows : 0;
  $('pos').textContent = `строка ${num(row)} / ${num(total)} · сэмпл ${num(sample)} · ${(sample / SR).toFixed(3)} с`;
}

// --- Экспорт ----------------------------------------------------------

const metaOf = (p) => ({
  seed: null, signal: state.signal, tuning: p.tuning, method: state.method,
  dither: state.dither, pulseWidth: state.pulseWidth, sampleRate: SR,
  rasterWidth: state.width, rasterHeight: p.rows, seconds: state.seconds,
  frequencies: p.tones.map((t) => t.freq),
});
const nameOf = (p, ext) => `bitraster_${state.signal}_${p.tuning}_${state.method}_${state.dither}` +
  `_pw${state.pulseWidth}_sr${SR}_w${state.width}_h${p.rows}.${ext}`;

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportRaw() {
  for (const p of state.passes) {
    download(new Blob([packBits(p.bits)], { type: 'application/octet-stream' }), nameOf(p, 'bin'));
  }
  msg(`RAW: ${state.passes.length} файл(ов), ${num(state.passes[0].bits.length)} бит, ${SR} бит/с`);
}

function exportPng() {
  for (const p of state.passes) {
    p.view.querySelector('canvas').toBlob(async (blob) => {
      download(pngWithMetadata(await blob.arrayBuffer(), 'onebit', JSON.stringify(metaOf(p))), nameOf(p, 'png'));
    }, 'image/png');
  }
  msg('PNG: метаданные в имени файла и в текстовом чанке внутри');
}

// --- Инициализация ----------------------------------------------------

function mkSelect(id, opts, value, onChange) {
  const sel = $(id);
  for (const [v, label, disabled] of opts) {
    const o = document.createElement('option');
    o.value = v; o.textContent = label; if (disabled) o.disabled = true;
    sel.appendChild(o);
  }
  sel.value = value;
  sel.addEventListener('change', () => onChange(sel.value));
}

function applyWidth(w) {
  state.width = Math.max(8, Math.min(4096, Math.round(w)));
  $('widthNum').value = state.width;
  [...$('widths').children].forEach((c) => c.classList.toggle('on', Number(c.textContent) === state.width));
  if (state.passes.length) layout();
}

function init() {
  mkSelect('signal', Object.entries(SIGNALS).map(([k, v]) => [k, v.name]), state.signal, (v) => { state.signal = v; });
  mkSelect('tuning', [['just', 'JUST'], ['tet', '12-TET']], state.tuning, (v) => { state.tuning = v; });
  mkSelect('method', [['pinpulse', 'PIN / PULSE'], ['pwm', 'PWM'], ['xor', 'XOR'],
                      ['sigma', 'SIGMA DELTA (не реализован)', true]], state.method, (v) => { state.method = v; });
  mkSelect('dither', [['error', 'DETERMINISTIC'], ['random', 'RANDOM']], state.dither, (v) => { state.dither = v; });
  mkSelect('seconds', [[4, '4 с'], [8, '8 с'], [30, '30 с']], state.seconds, (v) => { state.seconds = Number(v); });

  for (const w of [128, 192, 256, 384, 480, 1200]) {
    const b = document.createElement('button');
    b.textContent = w;
    b.className = w === state.width ? 'w on' : 'w';
    b.addEventListener('click', () => applyWidth(w));
    $('widths').appendChild(b);
  }
  $('widthNum').value = state.width;
  $('pulseWidth').value = state.pulseWidth;

  $('compare').checked = state.compare;
  $('compare').addEventListener('change', () => {
    state.compare = $('compare').checked;
    $('tuning').disabled = state.compare;
  });
  $('tuning').disabled = state.compare;

  $('render').addEventListener('click', render);
  $('raw').addEventListener('click', exportRaw);
  $('png').addEventListener('click', exportPng);
  $('widthNum').addEventListener('change', () => applyWidth(Number($('widthNum').value)));
  $('wminus').addEventListener('click', () => applyWidth(state.width - 1));
  $('wplus').addEventListener('click', () => applyWidth(state.width + 1));
  $('pulseWidth').addEventListener('change', () => {
    state.pulseWidth = Math.max(0.5, Math.min(12, Number($('pulseWidth').value) || 7));
    $('pulseWidth').value = state.pulseWidth;
  });
  $('zoom').addEventListener('change', () => { state.zoom = Number($('zoom').value); if (state.passes.length) layout(); });
  $('scrub').addEventListener('input', () => scrubTo(Number($('scrub').value)));
  $('sStart').addEventListener('click', () => scrubTo(0));
  $('sPrev').addEventListener('click', () => scrubTo(Number($('scrub').value) - 1));
  $('sNext').addEventListener('click', () => scrubTo(Number($('scrub').value) + 1));
  $('sEnd').addEventListener('click', () => scrubTo(state.passes[0] ? state.passes[0].rows - 1 : 0));

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft') { applyWidth(state.width - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { applyWidth(state.width + 1); e.preventDefault(); }
    if (e.code === 'Space') { e.preventDefault(); state.playingIdx >= 0 ? stop() : play(0); }
  });

  render();
}

init();
