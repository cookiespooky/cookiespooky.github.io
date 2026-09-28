// Ритм — самостоятельный уровень генерации, а не побочный эффект мелодии.
// Паттерн длиной в несколько тактов зацикливается; именно его и держит
// FREEZE RHYTHM.

// Метрический вес шага: сильная доля > доля > восьмая > шестнадцатая.
function metricWeight(step, steps) {
  const perBeat = steps / 4;
  if (step % steps === 0) return 1.0;
  if (perBeat >= 1 && step % perBeat === 0) return 0.72;
  if (perBeat >= 2 && step % (perBeat / 2) === 0) return 0.45;
  return 0.26;
}

export function generateRhythm(rng, params) {
  const steps = params.subdivision;           // шагов в такте
  const bars = params.patternLength;          // тактов в паттерне
  const density = params.density / 100;
  const sync = params.syncopation / 100;

  const grid = [];
  for (let b = 0; b < bars; b++) {
    const row = [];
    for (let s = 0; s < steps; s++) {
      const w = metricWeight(s, steps);
      // Синкопа переворачивает предпочтение: на максимуме сильные доли
      // становятся наименее вероятными.
      const shaped = (1 - sync) * w + sync * (1 - w);
      // Сильные позиции заполняются раньше слабых: показатель степени падает
      // с метрическим весом. density 0 -> тишина, density 100 -> вся сетка.
      const p = Math.pow(density, 1.7 - shaped);
      row.push(rng.bool(p));
    }
    if (!row.some(Boolean)) row[rng.int(steps)] = true; // такт не должен быть немым
    grid.push(row);
  }

  // Акценты: сильные позиции, попавшие в паттерн, звучат громче.
  const accents = grid.map((row, b) =>
    row.map((on, s) => on && (metricWeight(s, steps) > 0.6 || rng.bool(0.12 * (1 + sync))))
  );

  return {
    kind: 'rhythm',
    steps, bars, grid, accents,
    stepBeats: 4 / steps,
    // Список онсетов такта: позиция в долях + акцент.
    onsets(bar) {
      const b = ((bar % this.bars) + this.bars) % this.bars;
      const out = [];
      for (let s = 0; s < this.steps; s++) {
        if (this.grid[b][s]) out.push({ step: s, beat: s * this.stepBeats, accent: this.accents[b][s] });
      }
      return out;
    },
    describe() {
      return this.grid.map((r) => r.map((x) => (x ? 'x' : '.')).join('')).join(' | ');
    },
  };
}

export function varyRhythm(rhythm, rng, amount) {
  const next = {
    ...rhythm,
    grid: rhythm.grid.map((r) => r.slice()),
    accents: rhythm.accents.map((r) => r.slice()),
  };
  const flips = 1 + Math.floor(amount * rhythm.steps * 0.35);
  for (let i = 0; i < flips; i++) {
    const b = rng.int(next.bars);
    const s = rng.int(next.steps);
    next.grid[b][s] = !next.grid[b][s];
    next.accents[b][s] = next.grid[b][s] && rng.bool(0.3);
  }
  for (let b = 0; b < next.bars; b++) {
    if (!next.grid[b].some(Boolean)) next.grid[b][rng.int(next.steps)] = true;
  }
  next.onsets = rhythm.onsets;
  next.describe = rhythm.describe;
  return next;
}

// Свинг: чётные шаги остаются на месте, нечётные сдвигаются вперёд.
export function swingOffset(step, swing, stepBeats) {
  return step % 2 === 1 ? swing * 0.5 * stepBeats : 0;
}
