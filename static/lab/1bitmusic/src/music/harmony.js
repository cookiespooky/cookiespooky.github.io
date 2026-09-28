// Гармония: аккорды выбираются не случайно, а по функциональным весам.
// Memory управляет двумя вещами сразу — насколько сильно решает марковская
// цепь (против статического априорного распределения) и насколько узок
// словарь аккордов. Memory 0: каждый аккорд независим, доступны все семь
// ступеней. Memory 100: жёсткая цепь по словарю из трёх аккордов, у гармонии
// появляется узнаваемая идентичность.

import { harmonyIntervals, degreeToMidi, scaleOf } from './scales.js';

// Функция ступени: T тоника, S субдоминанта, D доминанта.
const FUNCTION_OF = ['T', 'S', 'T', 'S', 'D', 'T', 'D']; // I ii iii IV V vi vii

// Куда тяготеет каждая функция.
const FUNCTION_MOVE = {
  T: { T: 0.15, S: 0.42, D: 0.43 },
  S: { T: 0.14, S: 0.20, D: 0.66 },
  D: { T: 0.72, S: 0.09, D: 0.19 },
};

// Вес ступени внутри своей функции.
const DEGREE_IN_FUNCTION = [0.55, 0.36, 0.14, 0.64, 0.74, 0.31, 0.26];

// Априорная частота ступени, когда памяти нет.
const PRIOR = [0.30, 0.09, 0.06, 0.17, 0.20, 0.13, 0.05];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

function markovRow(fromDegree) {
  const fromFn = FUNCTION_OF[fromDegree];
  const move = FUNCTION_MOVE[fromFn];
  const row = new Array(7);
  for (let d = 0; d < 7; d++) {
    row[d] = move[FUNCTION_OF[d]] * DEGREE_IN_FUNCTION[d];
    if (d === fromDegree) row[d] *= 0.18; // не топчемся на месте
  }
  return row;
}

// Словарь ступеней, к которым тяготеет данное состояние. Тоника и доминанта
// всегда внутри — иначе на высокой Memory негде взять каданс.
function buildPalette(rng, memory) {
  const size = Math.round(7 - 4 * memory);
  const palette = memory > 0.45 ? [0, 4] : [0];
  const pool = [1, 2, 3, 5, 6].concat(memory > 0.45 ? [] : [4]);
  const weights = pool.map((d) => PRIOR[d]);
  while (palette.length < size && pool.length) {
    const i = rng.weighted(weights);
    palette.push(pool[i]);
    pool.splice(i, 1);
    weights.splice(i, 1);
  }
  return palette.sort((a, b) => a - b);
}

// Аккорд как терцовая надстройка над ступенью лада.
function buildChord(degree, intervals, rootPc, complexity, tension, rng) {
  // Complexity — вероятность надстройки, а не фиксированный размер:
  // на средних значениях трезвучия и септаккорды перемежаются.
  let size = 3;
  if (rng.bool(complexity * 1.45)) size = 4;
  if (size === 4 && rng.bool(complexity * 0.85)) size = 5;
  const degrees = [];
  for (let i = 0; i < size; i++) degrees.push(degree + i * 2);

  const tones = degrees.map((d) => degreeToMidi(rootPc, intervals, d, 3));
  const alterations = [];

  // Tension добавляет хроматические альтерации — но не трогает основной тон,
  // поэтому аккорд остаётся узнаваемым, а не превращается в кластер.
  if (tones.length > 2 && rng.bool(tension * 0.55)) {
    const idx = 1 + rng.int(tones.length - 1);
    const dir = rng.bool(0.5) ? 1 : -1;
    tones[idx] += dir;
    alterations.push({ index: idx, dir });
  }

  const pcs = [];
  for (const t of tones) {
    const pc = ((t % 12) + 12) % 12;
    if (pcs.indexOf(pc) === -1) pcs.push(pc);
  }

  const quality = alterations.length ? '~' : '';
  return {
    degree,
    tones,
    pcs,
    root: tones[0],
    label: ROMAN[degree] + (size === 4 ? '7' : size === 5 ? '9' : '') + quality,
    fn: FUNCTION_OF[degree],
  };
}

// Прогрессия фиксированной длины, которая зацикливается. Именно её и
// замораживает FREEZE HARMONY — слышно как повтор одного и того же круга.
export function generateHarmony(rng, params) {
  const intervals = harmonyIntervals(params.scale);
  const rootPc = params.keyPc;
  const memory = params.memory / 100;
  const complexity = params.complexity / 100;
  const tension = params.tension / 100;

  const palette = buildPalette(rng, memory);
  const length = rng.bool(0.55) ? 8 : 4;

  const degrees = [];
  let cur = 0;
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      cur = 0; // круг начинается с тоники
    } else {
      const mk = markovRow(cur);
      const w = new Array(7);
      for (let d = 0; d < 7; d++) {
        const blended = (1 - memory) * PRIOR[d] + memory * mk[d];
        const inPalette = palette.indexOf(d) !== -1;
        w[d] = blended * (inPalette ? 1 : Math.pow(0.05, memory));
      }
      // Предпоследний аккорд круга тянем к доминанте — получается каданс.
      if (i === length - 1) { w[4] *= 1 + 2.5 * memory; w[6] *= 1 + 1.5 * memory; }
      cur = rng.weighted(w);
    }
    degrees.push(cur);
  }

  const chords = degrees.map((d) => buildChord(d, intervals, rootPc, complexity, tension, rng));

  return {
    kind: 'harmony',
    length,
    palette,
    chords,
    chordAt(bar) { return this.chords[((bar % this.length) + this.length) % this.length]; },
    describe() { return this.chords.map((c) => c.label).join(' '); },
  };
}

// Вариация внутри секции: меняем один-два аккорда, каданс не трогаем.
export function varyHarmony(harmony, rng, params, amount) {
  const intervals = harmonyIntervals(params.scale);
  const memory = params.memory / 100;
  const complexity = params.complexity / 100;
  const tension = params.tension / 100;
  const next = { ...harmony, chords: harmony.chords.slice() };

  const changes = 1 + Math.floor(amount * 2.2);
  for (let n = 0; n < changes; n++) {
    const i = 1 + rng.int(Math.max(1, harmony.length - 2));
    const prev = next.chords[i - 1].degree;
    const mk = markovRow(prev);
    const w = new Array(7);
    for (let d = 0; d < 7; d++) {
      w[d] = (1 - memory) * PRIOR[d] + memory * mk[d];
      if (harmony.palette.indexOf(d) === -1) w[d] *= Math.pow(0.05, memory);
    }
    const deg = rng.weighted(w);
    next.chords[i] = buildChord(deg, intervals, params.keyPc, complexity, tension, rng);
  }
  Object.setPrototypeOf(next, Object.getPrototypeOf(harmony));
  next.chordAt = harmony.chordAt;
  next.describe = harmony.describe;
  return next;
}

// Раскладка аккорда по голосам. Тесное расположение в низком регистре —
// главный источник мути: у однобитных голосов десятки сильных гармоник, и
// соседние тоны внутри одной критической полосы гарантированно бьются.
// Поэтому голоса разводятся не ближе minGap полутонов и не ниже lowest.
export function voiceChord(chord, { lowest = 55, count = 3, spread = true, ceiling = 84 } = {}) {
  const pcs = [];
  for (const t of chord.tones) {
    const pc = ((t % 12) + 12) % 12;
    if (pcs.indexOf(pc) === -1) pcs.push(pc);
  }
  // Тесная раскладка снизу вверх.
  const out = [];
  for (const pc of pcs.slice(0, Math.max(2, count))) {
    const floor = out.length ? out[out.length - 1] + 1 : lowest;
    out.push(floor + ((((pc - floor) % 12) + 12) % 12));
  }
  // Разведение через октаву. Требовать минимальный интервал напрямую нельзя:
  // у терцовых аккордов соседние тоны стоят в трёх полутонах, и порог больше
  // трёх выталкивает каждый следующий голос на октаву вверх — аккорд
  // разлетается на три октавы, верхний голос уходит за 3 кГц. Поэтому
  // поднимаем через один и держим потолок.
  if (spread) {
    for (let i = 1; i < out.length; i += 2) {
      if (out[i] + 12 <= ceiling) out[i] += 12;
    }
  }
  return out;
}

export { ROMAN };
