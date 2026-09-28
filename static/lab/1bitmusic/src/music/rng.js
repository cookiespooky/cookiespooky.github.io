// Детерминированный ГПСЧ и ветвление потоков по слоям генерации.
//
// Ключевая идея для FREEZE: у каждого слоя (harmony / rhythm / motif / melody /
// synth) свой независимый поток, засеянный от (seed, имя слоя, счётчик слоя).
// Счётчик растёт только когда этот слой действительно мутирует. Замороженный
// слой не двигает свой счётчик — и выдаёт ровно тот же материал, сколько бы
// раз ни нажали MUTATE. Общего потока, через который мутация одного слоя
// протекала бы в другой, не существует.

function hashSeeder(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

export class RNG {
  constructor(seedStr) {
    const seeder = hashSeeder(String(seedStr));
    this.a = seeder(); this.b = seeder(); this.c = seeder(); this.d = seeder();
    if ((this.a | this.b | this.c | this.d) === 0) this.d = 1;
    for (let i = 0; i < 15; i++) this.next();
  }

  // sfc32
  next() {
    let a = this.a | 0, b = this.b | 0, c = this.c | 0, d = this.d | 0;
    const t = ((a + b) | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    this.a = a; this.b = b; this.c = c; this.d = d;
    return (t >>> 0) / 4294967296;
  }

  int(n) { return Math.floor(this.next() * n); }
  range(lo, hi) { return lo + this.next() * (hi - lo); }
  intRange(lo, hi) { return lo + this.int(hi - lo + 1); }
  bool(p) { return this.next() < p; }
  pick(arr) { return arr[this.int(arr.length)]; }
  sign() { return this.next() < 0.5 ? -1 : 1; }

  // Индекс по массиву весов (веса не обязаны быть нормированы).
  weighted(weights) {
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += Math.max(0, weights[i]);
    if (total <= 0) return this.int(weights.length);
    let r = this.next() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= Math.max(0, weights[i]);
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }

  // Приблизительно нормальное распределение, обрезанное в [-1, 1].
  gauss() {
    const v = (this.next() + this.next() + this.next() - 1.5) / 1.5;
    return Math.max(-1, Math.min(1, v));
  }

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// Поток слоя. Один и тот же (seed, layer, counter) всегда даёт один и тот же поток.
export function layerRNG(seed, layer, counter, salt = '') {
  return new RNG(`${seed}|${layer}|${counter}|${salt}`);
}

export function randomSeed() {
  return Math.floor(Math.random() * 900000) + 100000;
}
