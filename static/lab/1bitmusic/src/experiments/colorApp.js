// COLOR SOUND: прямой и обратный ход между цветом и аккордом.

import { renderEvents, extractBits } from '../audio/audioEngine.js';
import { bitsToImageData } from './rasterLab.js';
import {
  chordFromColor, colorFromRatio, parseRatio, chordBitPeriod, chordEvents,
  toHex, fromHex, intervalOf, gcd,
} from './colorSound.js';
import { initForcedChoice } from './fcApp.js';

const $ = (id) => document.getElementById(id);
const SR = 48000;
const num = (n) => n.toLocaleString('ru');
const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const state = {
  tuning: 'just', base: 880, fold: true, rasterWidth: 600,
  colorA: [168, 210, 252], ratioText: '4:5:6',
  gradA: [168, 210, 252], gradB: [255, 96, 32], gradSeconds: 20,
  ctx: null, source: null, playing: null, startedAt: 0, bits: null,
};

const msg = (t) => { $('msg').textContent = t; };
const opts = () => ({ base: state.base, tuning: state.tuning, fold: state.fold });

// --- Таблица голосов --------------------------------------------------

function voiceTable(chord) {
  const rows = chord.voices.map((v) => {
    if (v.silent) return `<tr><td>${v.name}</td><td>0</td><td>—</td><td>—</td><td class="dim">молчит</td><td>—</td></tr>`;
    const c = v.interval.cents;
    return `<tr><td>${v.name}</td><td>${v.value}</td>
      <td>${v.ratio.toFixed(4)}</td>
      <td>${v.freq.toFixed(2)}</td>
      <td>${v.interval.name}</td>
      <td class="${c != null && Math.abs(c) < 1 ? 'hit' : ''}">${c == null ? '—' : (c >= 0 ? '+' : '') + c.toFixed(1)}</td></tr>`;
  });
  return rows.join('');
}

function periodLine(chord) {
  const N = chordBitPeriod(chord, SR);
  if (state.tuning === 'tet') {
    return `<b class="warn">периода нет: темперированные отношения иррациональны, цвет больше не кодирует частоты точно</b>`;
  }
  return N == null
    ? '<b class="warn">период не посчитан (унисон или переполнение)</b>'
    : `<b>${num(N)} сэмплов = ${(N / SR * 1000).toFixed(2)} мс</b> — узор точно повторяется, цвет является кристаллом`;
}

// --- Прямой ход -------------------------------------------------------

function updateForward() {
  const chord = chordFromColor({ rgb: state.colorA, ...opts() });
  $('swatchA').style.background = toHex(state.colorA);
  $('hexA').value = toHex(state.colorA);
  $('pickA').value = toHex(state.colorA);
  $('rgbA').textContent = state.colorA.join(', ');
  $('redA').textContent = chord.reduced.join(' : ') + (chord.divisor > 1 ? `   (÷${chord.divisor})` : '   (уже несократимо)');
  $('tblA').innerHTML = voiceTable(chord);
  $('perA').innerHTML = periodLine(chord);
  return chord;
}

// --- Обратный ход -----------------------------------------------------

function updateInverse() {
  const ratio = parseRatio(state.ratioText);
  if (!ratio) { $('invNote').innerHTML = '<b class="bad">не разобрал отношение — нужно три числа, например 4:5:6</b>'; return null; }
  const res = colorFromRatio(ratio, state.tuning);
  $('swatchB').style.background = toHex(res.rgb);
  $('hexB').textContent = toHex(res.rgb);
  $('rgbB').textContent = res.rgb.join(', ');

  const chord = chordFromColor({ rgb: res.rgb, ...opts() });
  $('tblB').innerHTML = voiceTable(chord);

  // Замыкание круга: цвет, полученный из отношения, должен свестись обратно
  // к тому же отношению. Сравнивать надо сокращённые дроби — 255:0:0 и 1:0:0
  // это один и тот же аккорд, и расхождением тут было бы только моё сравнение.
  const back = chord.reduced.join(':');
  const rg = ratio.every(Number.isInteger)
    ? (ratio.reduce((a, b) => gcd(a, b), 0) || 1) : 1;
  const want = ratio.map((x) => Number.isInteger(x) ? x / rg : x).join(':');
  const closed = back === want;
  $('invNote').innerHTML =
    `<div class="kv"><span>масштаб</span><b>${res.k == null ? '—' : (Number.isInteger(res.k) ? '×' + res.k : '×' + res.k.toFixed(3))}</b></div>` +
    `<div class="kv"><span>обратно из цвета</span><b>${back}</b></div>` +
    `<div class="kv ${closed ? 'ok' : 'bad'}"><span>круг замкнулся</span><b>${closed ? 'да, побитно то же отношение' : `нет: ${want} → ${back}`}</b></div>` +
    `<div class="kv"><span>период</span>${periodLine(chord)}</div>`;
  return chord;
}

// --- Градиент ---------------------------------------------------------

function updateGradient() {
  $('swatchG1').style.background = toHex(state.gradA);
  $('swatchG2').style.background = toHex(state.gradB);
  $('gradbar').style.background = `linear-gradient(90deg, ${toHex(state.gradA)}, ${toHex(state.gradB)})`;
  const a = chordFromColor({ rgb: state.gradA, ...opts() });
  const b = chordFromColor({ rgb: state.gradB, ...opts() });
  $('gradInfo').innerHTML =
    `<div class="kv"><span>A</span><b>${toHex(state.gradA)} · ${a.reduced.join(':')} · ${a.voices.map((v) => v.silent ? '—' : v.freq.toFixed(0)).join(' / ')} Гц</b></div>` +
    `<div class="kv"><span>B</span><b>${toHex(state.gradB)} · ${b.reduced.join(':')} · ${b.voices.map((v) => v.silent ? '—' : v.freq.toFixed(0)).join(' / ')} Гц</b></div>`;
  return { a, b };
}

// --- Звук -------------------------------------------------------------

async function playEvents(events, seconds, tag) {
  stop();
  if (!events.length) { msg('нечего играть: все каналы нулевые'); return; }
  msg('рендер…');
  const samples = await renderEvents(events, seconds, {
    sampleRate: SR, method: 'pinpulse', dither: 'error',
    gain: 0.5, pulseDensity: 1, modulePath: './src/audio/oneBitProcessor.js',
  });
  const info = extractBits(samples);
  state.bits = info.bits;
  drawRaster();

  if (!state.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    state.ctx = new C({ sampleRate: SR });
  }
  if (state.ctx.state === 'suspended') await state.ctx.resume();
  const buf = state.ctx.createBuffer(1, samples.length, SR);
  buf.copyToChannel(samples, 0);
  const src = state.ctx.createBufferSource();
  src.buffer = buf;
  src.connect(state.ctx.destination);
  src.onended = () => { if (state.source === src) stop(); };
  src.start();
  state.source = src;
  state.playing = tag;
  state.startedAt = state.ctx.currentTime;
  state.duration = seconds;
  markButtons();
  msg(`значений сэмпла: ${info.distinctLevels} · единиц ${(100 * info.bits.reduce((n, b) => n + b, 0) / info.bits.length).toFixed(2)}%`);
  if (tag === 'grad') followGradient();
}

function stop() {
  if (state.source) { try { state.source.stop(); } catch {} state.source = null; }
  state.playing = null;
  markButtons();
}

function markButtons() {
  for (const [id, tag] of [['playA', 'a'], ['playB', 'b'], ['playG', 'grad']]) {
    $(id).textContent = state.playing === tag ? '■ STOP' : '▶ PLAY';
    $(id).classList.toggle('on', state.playing === tag);
  }
  if (state.playing !== 'grad') $('gradPos').style.display = 'none';
}

function followGradient() {
  if (state.playing !== 'grad') return;
  const t = Math.min(1, (state.ctx.currentTime - state.startedAt) / state.duration);
  const rgb = lerp(state.gradA, state.gradB, t);
  const chord = chordFromColor({ rgb, ...opts() });
  $('gradPos').style.display = 'block';
  $('gradPos').style.left = (t * 100) + '%';
  $('gradNow').style.background = toHex(rgb);
  $('gradNowTxt').innerHTML =
    `${toHex(rgb)} · ${rgb.join(',')} · <b>${chord.reduced.join(':')}</b> · ` +
    chord.voices.map((v) => v.silent ? '—' : v.freq.toFixed(0)).join(' / ') + ' Гц · ' +
    chord.voices.filter((v) => !v.silent).map((v) => v.interval.name).join(' ');
  requestAnimationFrame(followGradient);
}

// --- Растр ------------------------------------------------------------

function drawRaster() {
  if (!state.bits) return;
  const W = state.rasterWidth;
  const rows = Math.min(300, Math.floor(state.bits.length / W));
  const cv = $('raster');
  cv.width = W; cv.height = rows;
  cv.getContext('2d').putImageData(bitsToImageData(state.bits, W, rows), 0, 0);
  $('rasterInfo').textContent = `${W} × ${rows} px · строка = ${(W / SR * 1000).toFixed(2)} мс`;
}

// --- Проводка ---------------------------------------------------------

function refreshAll() { updateForward(); updateInverse(); updateGradient(); }

function init() {
  $('pickA').value = toHex(state.colorA);
  $('hexA').value = toHex(state.colorA);
  $('ratio').value = state.ratioText;
  $('pickG1').value = toHex(state.gradA);
  $('pickG2').value = toHex(state.gradB);
  $('base').value = state.base;
  $('fold').checked = state.fold;
  $('gradSeconds').value = state.gradSeconds;
  $('rw').value = state.rasterWidth;

  $('pickA').addEventListener('input', () => { state.colorA = fromHex($('pickA').value); refreshAll(); });
  $('hexA').addEventListener('change', () => {
    const c = fromHex($('hexA').value);
    if (c) { state.colorA = c; refreshAll(); } else msg('не разобрал HEX');
  });
  $('ratio').addEventListener('input', () => { state.ratioText = $('ratio').value; updateInverse(); });
  for (const [id, key] of [['pickG1', 'gradA'], ['pickG2', 'gradB']]) {
    $(id).addEventListener('input', () => { state[key] = fromHex($(id).value); updateGradient(); });
  }
  $('gradSeconds').addEventListener('change', () => { state.gradSeconds = Math.max(2, Math.min(120, Number($('gradSeconds').value) || 20)); $('gradSeconds').value = state.gradSeconds; });

  for (const t of ['just', 'tet']) {
    $('tune-' + t).addEventListener('click', () => {
      state.tuning = t;
      $('tune-just').classList.toggle('on', t === 'just');
      $('tune-tet').classList.toggle('on', t === 'tet');
      $('tetNote').style.display = t === 'tet' ? 'block' : 'none';
      refreshAll();
    });
  }
  $('tune-just').classList.add('on');

  $('base').addEventListener('change', () => { state.base = Math.max(20, Math.min(4000, Number($('base').value) || 880)); $('base').value = state.base; refreshAll(); });
  $('fold').addEventListener('change', () => { state.fold = $('fold').checked; refreshAll(); });
  $('rw').addEventListener('change', () => { state.rasterWidth = Math.max(8, Math.min(4096, Number($('rw').value) || 600)); $('rw').value = state.rasterWidth; drawRaster(); });
  $('rwPeriod').addEventListener('click', () => {
    const N = chordBitPeriod(chordFromColor({ rgb: state.colorA, ...opts() }), SR);
    if (!N) { msg('период не посчитан'); return; }
    // Период часто длиннее допустимой ширины. Обрезать его нельзя — строки
    // разъедутся. Берём наибольший делитель, который помещается: кратность
    // сохраняется, и строки по-прежнему совпадают.
    let w = Math.min(N, 4096);
    while (w >= 8 && N % w !== 0) w--;
    state.rasterWidth = Math.max(8, w);
    $('rw').value = state.rasterWidth;
    drawRaster();
    msg(w === N
      ? `ширина = период узора (${num(N)}) — строки должны совпасть`
      : `период ${num(N)} длиннее допустимой ширины; взят делитель ${num(w)} — кратность сохранена`);
  });

  $('playA').addEventListener('click', () => {
    if (state.playing === 'a') return stop();
    playEvents(chordEvents(updateForward(), 4), 4, 'a');
  });
  $('playB').addEventListener('click', () => {
    if (state.playing === 'b') return stop();
    const ch = updateInverse();
    if (ch) playEvents(chordEvents(ch, 4), 4, 'b');
  });
  $('playG').addEventListener('click', () => {
    if (state.playing === 'grad') return stop();
    const { a, b } = updateGradient();
    playEvents(chordEvents(a, state.gradSeconds, b), state.gradSeconds, 'grad');
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); state.playing ? stop() : $('playA').click(); }
  });

  refreshAll();
  initForcedChoice();
}

init();
