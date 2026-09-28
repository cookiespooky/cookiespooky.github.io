// Растровая лаборатория: чистая логика эксперимента «бит становится пикселем».
// Никаких преобразований бит → цвет, бит → параметр, бит → нота.
// Только 0 → чёрный, 1 → белый.

// --- Тестовые сигналы -------------------------------------------------
//
// Чистый строй задаётся рациональными отношениями, поэтому частоты остаются
// рациональными и период битового узора вычисляется точно. Равномерная
// темперация даёт множители 2^(n/12) — иррациональные, и точного периода
// у неё нет в принципе. Это и есть предмет проверки.

export const SIGNALS = {
  sine:  { name: 'SINE',  just: [[1, 1]],                 tet: [0] },
  fifth: { name: 'FIFTH', just: [[1, 1], [3, 2]],         tet: [0, 7] },
  triad: { name: 'TRIAD 4:5:6', just: [[1, 1], [5, 4], [3, 2]], tet: [0, 4, 7] },
};

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
const lcm = (a, b) => (a / gcd(a, b)) * b;

export function buildTones({ signal, tuning, base = 440 }) {
  const spec = SIGNALS[signal] || SIGNALS.sine;
  if (tuning === 'just') {
    return spec.just.map(([n, d]) => {
      // base целое, поэтому частота остаётся дробью p/q в точной арифметике.
      let p = base * n, q = d;
      const g = gcd(p, q);
      p /= g; q /= g;
      return { freq: p / q, rational: { p, q }, label: `${base}·${n}/${d}` };
    });
  }
  return spec.tet.map((semi) => ({
    freq: base * Math.pow(2, semi / 12),
    rational: null,
    label: semi === 0 ? `${base}` : `${base}·2^(${semi}/12)`,
  }));
}

export function buildEvents(tones, seconds) {
  return tones.map((t) => ({
    startTime: 0, endTime: seconds, freq: t.freq, vel: 1, kind: 'test',
  }));
}

// --- Точная арифметика периодов --------------------------------------

// Рациональное приближение цепной дробью — чтобы узнать знаменатель
// дробной части ширины импульса.
function toRational(x, maxDen = 10000) {
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
  do {
    const a = Math.floor(b);
    [h1, h0] = [a * h1 + h0, h1];
    [k1, k0] = [a * k1 + k0, k1];
    b = 1 / (b - a);
  } while (Math.abs(x - h1 / k1) > 1e-10 && k1 < maxDen && isFinite(b));
  return { p: h1, q: k1 };
}

// Дизеринг влияет на период не меньше, чем сами частоты.
//
// При детерминированном дизере дробная часть ширины импульса накапливается,
// и последовательность ширин повторяется через b импульсов, где b —
// знаменатель дроби. Целая ширина -> b = 1, дизер ничего не меняет.
// Случайный дизер не оставляет периода вообще: узор больше не повторяется,
// сколько бы мы ни ждали.
export function ditherPeriodPulses(pulseWidth, dither) {
  const frac = pulseWidth - Math.floor(pulseWidth);
  if (Math.abs(frac) < 1e-9) return 1;        // целая ширина — дизер не работает
  if (dither !== 'error') return null;        // случайный дизер убивает период
  return toRational(frac).q;
}

// Период битового узора одного тона в сэмплах. Импульсы стоят через P = sr/f
// сэмплов, узор повторяется на наименьшем целом N, кратном P.
// N = sr·q / gcd(p, sr·q) для частоты p/q. Если дизер добавляет свой цикл
// длиной b импульсов, число импульсов в периоде должно быть кратно и ему.
export function bitPeriodSamples(rational, sampleRate, ditherPulses = 1) {
  if (!rational) return null;                 // иррациональная частота
  if (ditherPulses == null) return null;      // случайный дизер
  const { p, q } = rational;
  const denom = sampleRate * q;
  if (!Number.isInteger(denom) || denom > Number.MAX_SAFE_INTEGER) return null;
  const N = denom / gcd(p, denom);
  if (ditherPulses <= 1) return N;
  const pulses = Math.round(N * p / (q * sampleRate));
  const k = lcm(pulses, ditherPulses);
  const out = N * (k / pulses);
  return Number.isSafeInteger(out) ? out : null;
}

export function combinedBitPeriod(tones, sampleRate, ditherPulses = 1) {
  let n = 1;
  for (const t of tones) {
    const N = bitPeriodSamples(t.rational, sampleRate, ditherPulses);
    if (N == null) return null;
    n = lcm(n, N);
    if (!Number.isSafeInteger(n)) return null;
  }
  return n;
}

// Через сколько строк узор с периодом N сэмплов совпадает сам с собой
// в растре ширины W: наименьшее R, при котором R·W кратно N.
export function rowsToRepeat(periodSamples, width) {
  if (periodSamples == null) return null;
  return periodSamples / gcd(periodSamples, width);
}

// Геометрия наклона: за строку фаза уходит на (W mod P) сэмплов.
// Знак выбирается по кратчайшему направлению — так наклон читается глазом.
export function driftOf(freq, sampleRate, width) {
  const period = sampleRate / freq;
  let mod = width % period;
  let drift = mod;
  if (drift > period / 2) drift -= period;
  return { period, mod, drift };
}

// --- Измерение повторения по фактическим битам ------------------------

// Хэш строки (FNV-1a), затем наименьший период последовательности хэшей
// через префикс-функцию, затем побайтная проверка найденного кандидата.
// Хэш нужен только чтобы не сравнивать строки квадратично; окончательный
// ответ проверяется по самим битам.
export function measuredRepeat(bits, width, rowStart, rowEnd) {
  const rows = rowEnd - rowStart;
  if (rows < 4) return null;

  const h = new Uint32Array(rows);
  for (let r = 0; r < rows; r++) {
    let x = 2166136261;
    const off = (rowStart + r) * width;
    for (let c = 0; c < width; c++) { x ^= bits[off + c]; x = Math.imul(x, 16777619); }
    h[r] = x >>> 0;
  }

  const f = new Int32Array(rows);
  for (let i = 1; i < rows; i++) {
    let j = f[i - 1];
    while (j > 0 && h[i] !== h[j]) j = f[j - 1];
    if (h[i] === h[j]) j++;
    f[i] = j;
  }
  const period = rows - f[rows - 1];
  if (period > rows / 2) return null;         // «повторения нет на этом отрезке»

  for (let r = 0; r + period < rows; r++) {
    const a = (rowStart + r) * width, b = (rowStart + r + period) * width;
    for (let c = 0; c < width; c++) if (bits[a + c] !== bits[b + c]) return null;
  }
  return period;
}

// --- Растр ------------------------------------------------------------

// Бит становится пикселем. Больше здесь ничего не происходит: ни
// сглаживания, ни интерполяции, ни коррекции контраста.
export function bitsToImageData(bits, width, rows) {
  const img = new ImageData(width, rows);
  const d = img.data;
  const n = width * rows;
  for (let i = 0; i < n; i++) {
    const v = bits[i] ? 255 : 0;
    const o = i << 2;
    d[o] = v; d[o + 1] = v; d[o + 2] = v; d[o + 3] = 255;
  }
  return img;
}

// --- PNG с метаданными ------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Вставка текстового чанка сразу после IHDR. Метаданные в имени файла
// теряются при переименовании, внутри PNG — нет.
export function pngWithMetadata(arrayBuffer, keyword, text) {
  const all = new Uint8Array(arrayBuffer);
  const HEAD = 8 + 25;                        // сигнатура + IHDR (всегда 13 байт данных)
  const kw = new TextEncoder().encode(keyword);
  const tx = new TextEncoder().encode(text);
  const dataLen = kw.length + 1 + tx.length;
  const chunk = new Uint8Array(12 + dataLen);
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, dataLen);
  chunk.set([0x74, 0x45, 0x58, 0x74], 4);     // 'tEXt'
  chunk.set(kw, 8);
  chunk[8 + kw.length] = 0;
  chunk.set(tx, 9 + kw.length);
  dv.setUint32(8 + dataLen, crc32(chunk.subarray(4, 8 + dataLen)));

  const out = new Uint8Array(all.length + chunk.length);
  out.set(all.subarray(0, HEAD), 0);
  out.set(chunk, HEAD);
  out.set(all.subarray(HEAD), HEAD + chunk.length);
  return new Blob([out], { type: 'image/png' });
}
