// COLOR → CHORD → 1-BIT, и обратно.
//
// RGB channel values are used as integer ratios; this is a mathematical
// sonification, not a physical model of light.
//
// Сырые восьмибитные значения берутся как есть, без линеаризации гаммы.
// Именно поэтому здесь возникает целочисленная арифметика, а период
// получившегося битового потока можно посчитать точно и проверить побитно.
// Физическому свету эти отношения не соответствуют.

export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
export const lcm = (a, b) => (a / gcd(a, b)) * b;

const NAMES = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7'];

// Название ближайшего темперированного интервала и отклонение от него в центах.
export function intervalOf(ratio) {
  if (!(ratio > 0)) return { name: '—', cents: null, semitones: null };
  const semis = 12 * Math.log2(ratio);
  const n = Math.round(semis);
  const oct = Math.floor(n / 12);
  const base = ((n % 12) + 12) % 12;
  const name = NAMES[base] + (oct > 0 ? `+${oct}окт` : oct < 0 ? `${oct}окт` : '');
  return { name, cents: (semis - n) * 100, semitones: n };
}

// Приведение голоса в слышимый диапазон умножением на степень двойки.
// Высотный класс сохраняется, меняется только регистр.
function foldRational(p, q, lo, hi) {
  let shift = 0;
  let f = p / q;
  if (!(f > 0)) return { p, q, shift };
  while (f < lo && shift < 12) { p *= 2; f = p / q; shift++; }
  while (f > hi && shift > -12) { q *= 2; f = p / q; shift--; }
  return { p, q, shift };
}

const reduce = (p, q) => { const g = gcd(p, q) || 1; return { p: p / g, q: q / g }; };

// --- Прямой ход: цвет -> аккорд ---------------------------------------
//
// Частота канала = base · value / 255. Отсюда три следствия, и ни одно
// из них не назначено вручную: яркость задаёт регистр, отношения каналов
// задают интервалы, серый (R=G=B) даёт унисон.

export function chordFromColor({ rgb, base = 880, tuning = 'just', fold = true }) {
  const [R, G, B] = rgb;
  const g = gcd(gcd(R, G), B) || 1;
  const reduced = [R / g, G / g, B / g];

  // Корень аккорда — самый тёмный ненулевой канал: тогда интервалы
  // читаются вверх от него, а не вниз.
  const nz = rgb.filter((v) => v > 0);
  const rootValue = nz.length ? Math.min(...nz) : 0;
  const voices = ['R', 'G', 'B'].map((name, i) => {
    const value = rgb[i];
    if (value === 0) {
      return { name, value, freq: 0, rational: null, ratio: 0, interval: intervalOf(0), shift: 0, silent: true };
    }
    let rat = reduce(base * value, 255);
    let shift = 0;

    if (tuning === 'tet') {
      // Темперация рвёт точное кодирование: 2^(n/12) иррационально, и
      // рациональной дроби у такой частоты нет — период не считается.
      const semis = Math.round(12 * Math.log2(value / rootValue));
      const f = base * (rootValue / 255) * Math.pow(2, semis / 12);
      return { name, value, freq: f, rational: null, ratio: value / rootValue,
               interval: intervalOf(Math.pow(2, semis / 12)), shift: 0, silent: false, tempered: true };
    }

    if (fold) { const r = foldRational(rat.p, rat.q, 70, 2200); rat = reduce(r.p, r.q); shift = r.shift; }
    return { name, value, freq: rat.p / rat.q, rational: rat, ratio: value / rootValue,
             interval: intervalOf(value / rootValue), shift, silent: false };
  });

  return { rgb, reduced, divisor: g, voices, base, tuning, fold };
}

// --- Обратный ход: отношение -> цвет ----------------------------------
//
// Отношение масштабируется наибольшим целым k, при котором старший канал
// ещё помещается в 255. Для целых отношений цвет получается точным.

export function colorFromRatio(ratio, tuning = 'just') {
  const clean = ratio.filter((x) => Number.isFinite(x) && x >= 0);
  if (clean.length !== 3) return null;
  const max = Math.max(...clean);
  if (!(max > 0)) return { rgb: [0, 0, 0], exact: true, k: 0 };

  if (tuning === 'tet') {
    // В темперации отношения иррациональны, целого k не существует —
    // цвет получается округлением и перестаёт точно кодировать частоты.
    const root = Math.min(...clean.filter((x) => x > 0));
    const rgb = clean.map((x) => {
      if (x <= 0) return 0;
      const semis = Math.round(12 * Math.log2(x / root));
      return Math.round(255 * Math.pow(2, semis / 12) / Math.pow(2, Math.round(12 * Math.log2(max / root)) / 12));
    });
    return { rgb, exact: false, k: null };
  }

  const allInt = clean.every((x) => Number.isInteger(x));
  const k = allInt ? Math.floor(255 / max) : 255 / max;
  const rgb = clean.map((x) => Math.max(0, Math.min(255, Math.round(x * k))));
  const exact = allInt && k >= 1 && clean.every((x, i) => rgb[i] === x * k);
  return { rgb, exact, k };
}

export function parseRatio(text) {
  const parts = String(text).split(/[:\s,]+/).filter(Boolean).map(Number);
  if (parts.length !== 3 || parts.some((x) => !Number.isFinite(x) || x < 0)) return null;
  return parts;
}

// --- Период битового потока -------------------------------------------
//
// Та же арифметика, что в растровой лаборатории: у частоты p/q узор
// повторяется через sr·q/gcd(p, sr·q) сэмплов. Отношения каналов RGB
// всегда рациональны, поэтому у любого цвета период есть — каждый цвет
// это кристалл. Темперированный режим периода не даёт вовсе.

export function chordBitPeriod(chord, sampleRate) {
  let n = 1;
  for (const v of chord.voices) {
    if (v.silent) continue;
    if (!v.rational) return null;
    const { p, q } = v.rational;
    const denom = sampleRate * q;
    if (!Number.isSafeInteger(denom)) return null;
    n = lcm(n, denom / gcd(p, denom));
    if (!Number.isSafeInteger(n)) return null;
  }
  return n === 1 ? null : n;
}

// --- Разное -----------------------------------------------------------

export const toHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const fromHex = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export function chordEvents(chord, seconds, chordTo = null) {
  const out = [];
  chord.voices.forEach((v, i) => {
    if (v.silent || !(v.freq > 0)) return;
    const to = chordTo ? chordTo.voices[i] : null;
    out.push({
      startTime: 0, endTime: seconds, freq: v.freq,
      freqTo: to && to.freq > 0 ? to.freq : undefined,
      vel: 1, kind: 'test',
    });
  });
  return out;
}
