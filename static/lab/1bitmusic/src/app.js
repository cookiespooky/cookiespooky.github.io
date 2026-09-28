// Точка сборки: генератор + аудиодвижок + интерфейс.

import { Generator } from './music/generator.js';
import { randomSeed } from './music/rng.js';
import { AudioEngine, renderOffline, extractBits, packBits, bitsToWav } from './audio/audioEngine.js';
import { buildPanels, syncPanels } from './ui/controls.js';
import { Visualizer } from './ui/visualizer.js';

const $ = (id) => document.getElementById(id);

const generator = new Generator();
const engine = new AudioEngine(generator);
const viz = new Visualizer({
  scope: $('scope'), spectrum: $('spectrum'), stream: $('stream'), duty: $('duty'),
});

let refs = buildPanels($('panels'), generator.params, (key, value) => {
  generator.setParam(key, value);
  if (['gain', 'pulseDensity', 'jitter', 'noise', 'method'].includes(key)) engine.pushParams();
  renderStatus();
});

engine.onBits = (packed, count, ones) => viz.pushBits(packed, count, ones);
engine.onBar = (bar) => {
  $('s-section').textContent = bar.section;
  $('s-chord').textContent = bar.chord;
  $('s-arc').textContent = `${bar.arcPhase.toUpperCase()} ${(bar.arc * 100).toFixed(0)}%`;
};

function renderStatus() {
  $('seed').textContent = String(generator.seed);
  for (const layer of ['harmony', 'rhythm', 'motif']) {
    const frozen = generator.frozen[layer];
    const el = $('s-' + layer);
    el.textContent = frozen ? 'FROZEN' : 'FREE';
    el.className = frozen ? 'froz' : 'free';
    $('fz-' + layer).classList.toggle('on', frozen);
  }
  const c = generator.counters;
  $('mutcount').textContent = `mutations  H${c.harmony} R${c.rhythm} M${c.motif}`;
}

function msg(text, ms = 4000) {
  $('msg').textContent = text;
  if (ms) setTimeout(() => { if ($('msg').textContent === text) $('msg').textContent = ''; }, ms);
}

// --- Transport ---------------------------------------------------------

$('play').addEventListener('click', async () => {
  try {
    const playing = await engine.toggle();
    $('play').textContent = playing ? '■ STOP' : '▶ PLAY';
    $('play').classList.toggle('on', playing);
    if (playing) {
      if (engine.analyser) viz.attachAnalyser(engine.analyser, engine.ctx.sampleRate);
      viz.start();
    } else {
      viz.stop();
    }
  } catch (e) {
    msg('AUDIO ERROR: ' + e.message, 0);
    console.error(e);
  }
});

// Громкость и приглушение живут в битовой области: воркет масштабирует ширину
// импульсов, поэтому выход остаётся строго двузначным даже во время фейда.
$('mute').addEventListener('click', () => {
  const muted = !engine.muted;
  engine.setMuted(muted);
  $('mute').classList.toggle('on', muted);
  $('mute').textContent = muted ? 'MUTED' : 'MUTE';
});
$('master').addEventListener('input', () => {
  const v = Number($('master').value);
  $('masterVal').textContent = v;
  engine.setMaster(v / 100, 15);
});

$('new').addEventListener('click', () => { generator.newState(); renderStatus(); msg('NEW STATE'); });
$('randseed').addEventListener('click', () => { generator.newState(randomSeed()); renderStatus(); msg('NEW SEED'); });
$('mutate').addEventListener('click', () => {
  const changed = generator.mutate();
  renderStatus();
  msg(changed.length ? 'MUTATED: ' + changed.join(', ').toUpperCase() : 'все слои заморожены');
});

for (const layer of ['harmony', 'rhythm', 'motif']) {
  $('fz-' + layer).addEventListener('click', () => {
    generator.setFrozen(layer, !generator.frozen[layer]);
    renderStatus();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
  const map = { '1': 'harmony', '2': 'rhythm', '3': 'motif' };
  if (e.code === 'Space') { e.preventDefault(); $('play').click(); }
  else if (e.key === 'n' || e.key === 'т') $('new').click();
  else if (e.key === 'm' || e.key === 'ь') $('mutate').click();
  else if (e.key === 'x' || e.key === 'ч') $('mute').click();
  else if (map[e.key]) $('fz-' + map[e.key]).click();
});

// --- Save / Load / Export ---------------------------------------------

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

$('save').addEventListener('click', () => {
  const json = JSON.stringify(generator.toJSON(), null, 2);
  download(new Blob([json], { type: 'application/json' }), `onebit-${generator.seed}.json`);
  msg('STATE SAVED');
});

$('load').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    generator.loadJSON(JSON.parse(await file.text()));
    syncPanels(refs, generator.params);
    engine.pushParams();
    renderStatus();
    msg('STATE LOADED · seed ' + generator.seed);
  } catch (err) {
    msg('LOAD FAILED: ' + err.message, 0);
  }
  e.target.value = '';
});

// Рендер идёт с копии состояния, чтобы не сдвинуть то, что играет сейчас.
function snapshot() {
  const g = new Generator();
  g.loadJSON(generator.toJSON());
  return g;
}

async function render(seconds) {
  msg(`RENDERING ${seconds}s …`, 0);
  const samples = await renderOffline(snapshot(), seconds);
  const info = extractBits(samples);
  msg('');
  const ones = info.bits.reduce((n, b) => n + b, 0);
  if (ones === 0) throw new Error('рендер вышел пустым — сообщи об этом, это баг, а не тишина в музыке');
  return { samples, ...info, ones, sampleRate: 48000 };
}

$('wav').addEventListener('click', async () => {
  try {
    const r = await render(30);
    download(bitsToWav(r.bits, r.sampleRate), `onebit-${generator.seed}.wav`);
    msg(`WAV: ${(r.bits.length/r.sampleRate).toFixed(0)}s, 8-bit PCM, значений сэмпла ${r.distinctLevels}, единиц ${(100*r.ones/r.bits.length).toFixed(2)}%`, 0);
  } catch (e) { msg('EXPORT FAILED: ' + e.message, 0); console.error(e); }
});

$('raw').addEventListener('click', async () => {
  try {
    const r = await render(30);
    const packed = packBits(r.bits);
    download(new Blob([packed], { type: 'application/octet-stream' }), `onebit-${generator.seed}.bin`);
    msg(`RAW: ${r.bits.length} бит = ${packed.length} байт, ${r.sampleRate} бит/с, единиц ${(100*r.ones/r.bits.length).toFixed(2)}%`, 0);
  } catch (e) { msg('EXPORT FAILED: ' + e.message, 0); console.error(e); }
});

// Честная проверка утверждения «на выходе один бит»: считаем, сколько
// различных значений встречается в отрендеренном сигнале.
$('verify').addEventListener('click', async () => {
  try {
    msg('RENDERING 4s …', 0);
    const samples = await renderOffline(snapshot(), 4);
    const levels = new Set();
    for (let i = 0; i < samples.length; i++) {
      levels.add(samples[i]);
      if (levels.size > 8) break;
    }
    const list = [...levels].map((v) => v.toFixed(4)).join(', ');
    const ones = samples.reduce((n, v) => n + (v > 0 ? 1 : 0), 0);
    msg(`${samples.length} сэмплов · различных значений: ${levels.size} [${list}] · единиц ${(100 * ones / samples.length).toFixed(2)}%`, 0);
  } catch (e) { msg('VERIFY FAILED: ' + e.message, 0); console.error(e); }
});

renderStatus();
viz.drawScope();
