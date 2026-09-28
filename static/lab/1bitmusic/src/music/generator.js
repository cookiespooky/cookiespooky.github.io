// Оркестратор: держит музыкальное состояние, слои, секционную структуру
// и кривую напряжения. Выдаёт по одному такту событий за раз — музыка
// не имеет конца по построению.

import { RNG, layerRNG, randomSeed } from './rng.js';
import { NOTE_NAMES, scaleOf, degreeToMidi } from './scales.js';
import { generateHarmony, varyHarmony, voiceChord } from './harmony.js';
import { generateRhythm, varyRhythm, swingOffset } from './rhythm.js';
import { generateMotif, mutateMotif } from './motif.js';
import { realizeBar } from './melody.js';
import { createAttractor } from './attractors.js';

export const DEFAULT_PARAMS = {
  key: 'C', scale: 'minor', tempo: 88,
  complexity: 35, tension: 25, memory: 65, voicing: 'arp',
  density: 65, swing: 12, subdivision: 8, patternLength: 2, syncopation: 30,
  range: 18, repetition: 35, mutation: 25,
  randomness: 45, humanize: 15,
  attractor: 'walk', tensionCurve: 60,
  gain: 32, pulseDensity: 50, jitter: 0, noise: 0,
  method: 'pinpulse',
};

// Какой слой пересобирать при изменении параметра.
const PARAM_LAYER = {
  key: 'harmony', scale: 'harmony', complexity: 'harmony', tension: 'harmony', memory: 'harmony',
  density: 'rhythm', subdivision: 'rhythm', patternLength: 'rhythm', syncopation: 'rhythm',
  randomness: 'motif',
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));

export class Generator {
  constructor(params = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.frozen = { harmony: false, rhythm: false, motif: false };
    this.counters = { harmony: 0, rhythm: 0, motif: 0, melody: 0 };
    this.seed = randomSeed();
    this.layers = { harmony: null, rhythm: null, motif: null };
    this.reset(true);
  }

  get keyPc() { return Math.max(0, NOTE_NAMES.indexOf(this.params.key)); }

  // --- Слои -------------------------------------------------------------

  buildLayer(name) {
    const rng = layerRNG(this.seed, name, this.counters[name]);
    const p = { ...this.params, keyPc: this.keyPc };
    if (name === 'harmony') return generateHarmony(rng, p);
    if (name === 'rhythm') return generateRhythm(rng, p);
    return generateMotif(rng, p);
  }

  rebuild(name, { force = false } = {}) {
    if (this.frozen[name] && !force) return;
    this.layers[name] = { base: this.buildLayer(name), current: null };
    this.applySectionVariation(name);
  }

  // Вариация слоя внутри секции: A -> A' -> A''. Детерминирована от
  // (seed, слой, счётчик, номер секции), поэтому воспроизводима.
  applySectionVariation(name) {
    const L = this.layers[name];
    if (!L) return;
    const variant = this.section ? this.section.variant : 0;
    if (variant === 0 || this.frozen[name]) { L.current = L.base; return; }
    const rng = layerRNG(this.seed, name, this.counters[name], `sec:${this.section.letter}:${variant}`);
    const amount = Math.min(0.8, 0.18 * variant);
    const p = { ...this.params, keyPc: this.keyPc };
    if (name === 'harmony') L.current = varyHarmony(L.base, rng, p, amount);
    else if (name === 'rhythm') L.current = varyRhythm(L.base, rng, amount);
    else L.current = mutateMotif(L.base, rng, amount);
  }

  // --- Состояние --------------------------------------------------------

  reset(rebuildAll) {
    this.bar = 0;
    this.section = { letter: 'A', variant: 0, index: 0 };
    this.barInSection = 0;
    this.arc = { phase: 'calm', barsLeft: 4, value: 0.15, target: 0.15 };
    this.cursor = { motifPos: 0, prevMidi: null, lastNotes: null };
    this.streams = {
      melody: layerRNG(this.seed, 'melody', this.counters.melody),
      form: layerRNG(this.seed, 'form', this.counters.melody),
    };
    this.attractor = createAttractor(
      this.params.attractor,
      layerRNG(this.seed, 'attractor', this.counters.melody),
      this.params.randomness / 100
    );
    if (rebuildAll) for (const n of ['harmony', 'rhythm', 'motif']) this.rebuild(n, { force: true });
    else this.applySectionVariationAll();
  }

  applySectionVariationAll() {
    for (const n of ['harmony', 'rhythm', 'motif']) this.applySectionVariation(n);
  }

  // NEW: новый seed. Замороженные слои сохраняются — это инструмент, а не рулетка.
  newState(seed = randomSeed()) {
    this.seed = seed;
    this.counters = { harmony: 0, rhythm: 0, motif: 0, melody: 0 };
    const keep = {};
    for (const n of ['harmony', 'rhythm', 'motif']) if (this.frozen[n]) keep[n] = this.layers[n];
    this.reset(false);
    for (const n of ['harmony', 'rhythm', 'motif']) {
      if (keep[n]) this.layers[n] = keep[n];
      else this.rebuild(n, { force: true });
    }
    return this.seed;
  }

  // MUTATE: та же система, изменённая. Счётчик двигается только у незамороженных слоёв.
  mutate() {
    const amount = this.params.mutation / 100;
    const changed = [];
    for (const n of ['harmony', 'rhythm', 'motif']) {
      if (this.frozen[n]) continue;
      // Слабая мутация трогает не все слои сразу.
      if (n !== 'motif' && !this.streams.form.bool(0.35 + amount * 0.6)) continue;
      this.counters[n]++;
      const rng = layerRNG(this.seed, n, this.counters[n], 'mut');
      const L = this.layers[n];
      const p = { ...this.params, keyPc: this.keyPc };
      if (n === 'harmony') L.base = varyHarmony(L.base, rng, p, amount);
      else if (n === 'rhythm') L.base = varyRhythm(L.base, rng, amount);
      else L.base = mutateMotif(L.base, rng, amount);
      this.applySectionVariation(n);
      changed.push(n);
    }
    this.counters.melody++;
    return changed;
  }

  setFrozen(name, value) {
    this.frozen[name] = value;
    if (!value) this.applySectionVariation(name);
    else this.layers[name].current = this.layers[name].base;
  }

  setParam(key, value) {
    this.params[key] = value;
    const layer = PARAM_LAYER[key];
    if (layer) this.rebuild(layer);
    if (key === 'attractor' || key === 'randomness') {
      this.attractor = createAttractor(
        this.params.attractor,
        layerRNG(this.seed, 'attractor', this.counters.melody),
        this.params.randomness / 100
      );
    }
  }

  // --- Форма и кривая напряжения ---------------------------------------

  advanceSection() {
    const r = this.streams.form;
    const s = this.section;
    // Структура вероятностная: чаще вариация текущей буквы, реже новая секция.
    const stay = r.bool(0.55);
    if (stay && s.variant < 3) {
      this.section = { letter: s.letter, variant: s.variant + 1, index: s.index + 1 };
    } else {
      const letters = ['A', 'B', 'C'];
      let next = r.weighted(s.letter === 'A' ? [0.45, 0.4, 0.15] : [0.55, 0.25, 0.2]);
      this.section = { letter: letters[next], variant: r.bool(0.3) ? 1 : 0, index: s.index + 1 };
    }
    this.barInSection = 0;
    this.applySectionVariationAll();
  }

  advanceArc() {
    const a = this.arc;
    const r = this.streams.form;
    const depth = this.params.tensionCurve / 100;
    if (a.barsLeft <= 0) {
      // CALM -> TENSION -> RELEASE, с вероятностными отклонениями.
      const nextPhase = a.phase === 'calm' ? (r.bool(0.75) ? 'tension' : 'calm')
        : a.phase === 'tension' ? (r.bool(0.7) ? 'release' : 'tension')
          : 'calm';
      a.phase = nextPhase;
      a.barsLeft = 3 + r.int(6);
      a.target = nextPhase === 'calm' ? r.range(0.05, 0.3)
        : nextPhase === 'tension' ? r.range(0.6, 1.0)
          : r.range(0.2, 0.5);
    }
    a.barsLeft--;
    a.value += (a.target - a.value) * 0.25;
    return clamp01(a.value * depth);
  }

  // --- Генерация такта --------------------------------------------------

  nextBar() {
    const p = this.params;
    const sectionBars = this.layers.harmony.current.length;
    if (this.barInSection >= sectionBars) this.advanceSection();

    const arcT = this.advanceArc();
    const H = this.layers.harmony.current;
    const R = this.layers.rhythm.current;
    const M = this.layers.motif.current;

    const chord = H.chordAt(this.bar);
    const effTension = clamp01((p.tension / 100) * 0.7 + arcT * 0.55);
    const rng = this.streams.melody;

    const events = [];
    const push = (beat, dur, midi, vel, kind) => {
      const hum = (p.humanize / 100) * 0.07 * rng.gauss();
      events.push({
        t: Math.max(0, beat + hum + swingOffset(Math.round(beat / R.stepBeats), p.swing / 100, R.stepBeats)),
        dur: Math.max(0.05, dur),
        midi, vel, kind,
      });
    };

    // BASS — основной тон аккорда, две октавы вниз.
    const bassMidi = chord.root - 12;
    push(0, 3.6, bassMidi, 0.95, 'bass');
    if (rng.bool(0.25 + (p.density / 100) * 0.4)) push(2, 1.6, bassMidi, 0.75, 'bass');

    // HARMONY. Выдержанная педаль из однобитных голосов звучит грязно: их
    // гармоники стоят в воздухе одновременно и бьются между собой. Измерения
    // по Сетаресу дают вдвое меньшую шероховатость, если те же ноты брать
    // по одной. Поэтому по умолчанию гармония арпеджируется, а педаль
    // оставлена переключателем — сравнивать лучше ухом.
    const voices = voiceChord(chord, { lowest: 60, count: 4 });
    const harmVel = 0.55 + arcT * 0.2;

    if (p.voicing === 'pad') {
      voices.slice(0, 3).forEach((m, i) => push(0.02 * i, 3.7, m, harmVel, 'harm'));
    } else if (p.voicing === 'struck') {
      for (let beat = 0; beat < 4; beat++) {
        if (beat > 0 && !rng.bool(0.5 + (p.density / 100) * 0.4)) continue;
        voices.forEach((m, i) => push(beat + 0.004 * i, 0.55, m, harmVel, 'harm'));
      }
    } else {
      // Число шагов арпеджио следует за Density, направление — за тактом.
      const steps = Math.max(3, Math.min(8, Math.round(2 + (p.density / 100) * 6)));
      const gap = 4 / steps;
      const order = rng.weighted([0.42, 0.22, 0.36]); // вверх / вниз / туда-обратно
      for (let s = 0; s < steps; s++) {
        let idx;
        if (order === 0) idx = s % voices.length;
        else if (order === 1) idx = voices.length - 1 - (s % voices.length);
        else {
          const span = Math.max(1, voices.length * 2 - 2);
          const k = s % span;
          idx = k < voices.length ? k : span - k;
        }
        push(s * gap, gap * 0.9, voices[idx], harmVel * (s === 0 ? 1 : 0.9), 'harm');
      }
    }

    // LEAD — мелодия.
    const { notes } = realizeBar({
      rng, motif: M, rhythm: R, chord, params: p,
      tension: effTension, bar: this.bar, cursor: this.cursor,
      attractor: this.attractor, keyPc: this.keyPc, scaleId: p.scale,
    });
    for (const n of notes) push(n.beat, n.dur, n.midi, n.vel, 'lead');

    const info = {
      bar: this.bar,
      section: `${this.section.letter}${"'".repeat(this.section.variant)}`,
      chord: chord.label,
      chordName: NOTE_NAMES[((chord.root % 12) + 12) % 12],
      arc: arcT,
      arcPhase: this.arc.phase,
      tempo: p.tempo,
      beats: 4,
      noteCount: notes.length,
    };

    this.bar++;
    this.barInSection++;
    return { events, ...info };
  }

  // --- Сохранение -------------------------------------------------------

  toJSON() {
    return {
      version: 1,
      seed: this.seed,
      counters: { ...this.counters },
      frozen: { ...this.frozen },
      params: { ...this.params },
    };
  }

  loadJSON(data) {
    if (!data || typeof data !== 'object') throw new Error('bad state');
    this.params = { ...DEFAULT_PARAMS, ...(data.params || {}) };
    this.counters = { harmony: 0, rhythm: 0, motif: 0, melody: 0, ...(data.counters || {}) };
    this.frozen = { harmony: false, rhythm: false, motif: false, ...(data.frozen || {}) };
    this.seed = data.seed ?? randomSeed();
    this.reset(true);
  }

  describe() {
    return {
      harmony: this.layers.harmony.current.describe(),
      rhythm: this.layers.rhythm.current.describe(),
      motif: this.layers.motif.current.describe(),
    };
  }
}
