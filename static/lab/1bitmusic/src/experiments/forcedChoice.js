// Тест с вынужденным выбором: слышно ли, какому из двух цветов принадлежит
// прозвучавший аккорд.
//
// Одной пробы «угадай цвет» мало: яркость → регистр это известное и устойчивое
// межмодальное соответствие, и на нём испытуемый наберёт очки, ничего не зная
// про оттенок. Поэтому пробы трёх типов идут вперемешку:
//
//   brightness — цвета одного отношения, но разной яркости. Различаются только
//                регистром. Ожидается результат выше случайного: это проверка,
//                что процедура вообще способна что-то поймать.
//   ratio      — цвета с совпадающим средним (геометрическим) и разными
//                отношениями каналов. Регистр как подсказка исключён.
//                ЭТО И ЕСТЬ ПРОВЕРЯЕМАЯ ГИПОТЕЗА.
//   control    — перестановка каналов: цвет заметно другой, а три частоты
//                ровно те же. Различить нельзя в принципе. Результат выше
//                случайного здесь означает утечку — визуальную подсказку,
//                порядковое смещение или ошибку в коде.

import { RNG } from '../music/rng.js';

const cents = (a, b) => 1200 * Math.log2(b / a);
const gmean = (c) => Math.pow(c[0] * c[1] * c[2], 1 / 3);

// Форма аккорда: два интервала в центах от нижнего голоса.
function shape(rgb) {
  const s = [...rgb].sort((a, b) => a - b);
  return [cents(s[0], s[1]), cents(s[0], s[2])];
}
const shapeDiff = (a, b) => {
  const x = shape(a), y = shape(b);
  return Math.max(Math.abs(x[0] - y[0]), Math.abs(x[1] - y[1]));
};

const randInt = (rng, lo, hi) => lo + rng.int(hi - lo + 1);
const randColor = (rng, lo, hi) => [randInt(rng, lo, hi), randInt(rng, lo, hi), randInt(rng, lo, hi)];

// Диапазон каналов подобран так, чтобы все голоса попадали в слышимую полосу
// без приведения октавами: приведение схлопнуло бы регистр и убило бы
// условие brightness.
const LO = 45, HI = 255;

function trialBrightness(rng) {
  for (let t = 0; t < 200; t++) {
    const r = [randInt(rng, 4, 12), randInt(rng, 4, 12), randInt(rng, 4, 12)];
    const kMin = Math.ceil(LO / Math.min(...r));
    const kMax = Math.floor(HI / Math.max(...r));
    if (kMax < kMin * 1.6) continue;
    const k1 = randInt(rng, kMin, Math.floor(kMax / 1.6));
    const k2 = randInt(rng, Math.ceil(k1 * 1.6), kMax);
    return [r.map((x) => x * k1), r.map((x) => x * k2)];
  }
  return [[60, 75, 90], [160, 200, 240]];
}

function trialRatio(rng) {
  for (let t = 0; t < 4000; t++) {
    const a = randColor(rng, 60, HI);
    const b = randColor(rng, 60, HI);
    // Совпадение среднего геометрического = совпадение общего регистра.
    if (Math.abs(cents(gmean(a), gmean(b))) > 15) continue;
    // Аккорды должны действительно различаться, иначе проба бессмысленна.
    if (shapeDiff(a, b) < 80) continue;
    return [a, b];
  }
  return [[100, 150, 200], [120, 128, 205]];
}

function trialControl(rng) {
  for (let t = 0; t < 200; t++) {
    const c = randColor(rng, LO, HI);
    const s = [...c].sort((x, y) => x - y);
    if (s[2] - s[0] < 45) continue;                 // цвет должен заметно измениться
    const perm = rng.bool(0.5) ? [c[2], c[0], c[1]] : [c[1], c[2], c[0]];
    return [c, perm];
  }
  return [[80, 140, 220], [220, 80, 140]];
}

const MAKERS = { brightness: trialBrightness, ratio: trialRatio, control: trialControl };

export const CONDITION_INFO = {
  brightness: { name: 'ЯРКОСТЬ', hint: 'разный регистр — известное соответствие, ожидается выше случайного' },
  ratio: { name: 'ОТНОШЕНИЕ', hint: 'регистр выровнен, различаются только интервалы — проверяемая гипотеза' },
  control: { name: 'КОНТРОЛЬ', hint: 'частоты идентичны, различить нельзя — проверка на утечку' },
};

// Полный блок проб: равные доли трёх условий, перемешанные.
export function buildBlock(seed, perCondition) {
  const rng = new RNG(`fc|${seed}`);
  const trials = [];
  for (const condition of ['brightness', 'ratio', 'control']) {
    for (let i = 0; i < perCondition; i++) {
      const [c1, c2] = MAKERS[condition](rng);
      // Два независимых броска: где какой цвет и какой из них звучит.
      const swap = rng.bool(0.5);
      trials.push({
        condition,
        left: swap ? c2 : c1,
        right: swap ? c1 : c2,
        target: rng.bool(0.5) ? 'left' : 'right',
        shapeDiff: Math.round(shapeDiff(c1, c2)),
        registerDiff: Math.round(cents(gmean(c1), gmean(c2))),
      });
    }
  }
  return rng.shuffle(trials);
}

// --- Статистика --------------------------------------------------------

// Точный биномиальный тест против p = 0.5. Приближения здесь не нужны:
// проб мало, а нормальное приближение на малых выборках врёт.
export function binomTest(k, n) {
  if (n === 0) return { p: 1, hitRate: 0, ci: [0, 1] };
  const lf = new Float64Array(n + 1);
  for (let i = 1; i <= n; i++) lf[i] = lf[i - 1] + Math.log(i);
  const pmf = (i) => Math.exp(lf[n] - lf[i] - lf[n - i] - n * Math.LN2);

  let tail = 0;
  if (k >= n / 2) { for (let i = k; i <= n; i++) tail += pmf(i); }
  else { for (let i = 0; i <= k; i++) tail += pmf(i); }
  const p = Math.min(1, 2 * tail);

  // Доверительный интервал Уилсона — на малых выборках ведёт себя честнее
  // интервала Вальда, который вылезает за границы [0,1].
  const z = 1.959964, ph = k / n;
  const denom = 1 + z * z / n;
  const centre = (ph + z * z / (2 * n)) / denom;
  const half = z * Math.sqrt(ph * (1 - ph) / n + z * z / (4 * n * n)) / denom;
  return { p, hitRate: ph, ci: [Math.max(0, centre - half), Math.min(1, centre + half)] };
}

// Сколько попаданий нужно, чтобы отвергнуть случайность при данном n.
export function thresholdFor(n, alpha = 0.05) {
  for (let k = Math.ceil(n / 2); k <= n; k++) if (binomTest(k, n).p < alpha) return k;
  return null;
}
