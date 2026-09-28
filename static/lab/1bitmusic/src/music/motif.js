// Мотив — контур в ступенях лада, независимый от ритма и от гармонии.
// Мелодия получается наложением контура на ритмическую сетку, поэтому
// FREEZE MOTIF и FREEZE RHYTHM действительно фиксируют разные вещи.

export function generateMotif(rng, params) {
  const randomness = params.randomness / 100;
  // Длина обычно не кратна числу онсетов в такте — контур и ритм расходятся
  // по фазе и дают вариативность без единой лишней случайной ноты.
  const len = 5 + rng.int(5); // 5..9 ячеек

  // Плоский контур звучит как одна залипшая нота, поэтому пересобираем,
  // пока размах не станет осмысленным.
  let cells;
  for (let attempt = 0; attempt < 8; attempt++) {
    cells = [];
    let deg = 0;
    for (let i = 0; i < len; i++) {
      if (i > 0) {
        const leap = rng.bool(0.12 + randomness * 0.45);
        const size = leap ? 2 + rng.int(4) : 1 + rng.int(2);
        deg += rng.sign() * size;
        deg = Math.max(-9, Math.min(9, deg));
      }
      cells.push({ deg, rest: i > 0 && rng.bool(0.10), accent: rng.bool(0.25) });
    }
    const sung = cells.filter((c) => !c.rest).map((c) => c.deg);
    const spread = Math.max(...sung) - Math.min(...sung);
    if (sung.length >= 3 && spread >= 2) break;
  }

  return { kind: 'motif', cells, describe() { return this.cells.map((c) => (c.rest ? '_' : c.deg)).join(' '); } };
}

// --- Трансформации -----------------------------------------------------

const OPS = {
  transpose(m, rng) {
    const n = rng.sign() * (1 + rng.int(3));
    return { cells: m.cells.map((c) => ({ ...c, deg: c.deg + n })) };
  },
  invert(m) {
    const pivot = m.cells[0].deg;
    return { cells: m.cells.map((c) => ({ ...c, deg: 2 * pivot - c.deg })) };
  },
  retrograde(m) {
    return { cells: m.cells.slice().reverse() };
  },
  rhythmicMutation(m, rng) {
    const cells = m.cells.map((c) => ({ ...c }));
    // Без противовеса паузы копятся от вариации к вариации и съедают мотив,
    // поэтому выше четверти пауз мутация начинает их снимать, а не ставить.
    const restShare = cells.filter((c) => c.rest).length / cells.length;
    const pool = cells
      .map((c, i) => i)
      .filter((i) => (restShare > 0.25 ? cells[i].rest : true));
    const i = pool.length ? pool[rng.int(pool.length)] : rng.int(cells.length);
    cells[i].rest = !cells[i].rest;
    if (cells.every((c) => c.rest)) cells[rng.int(cells.length)].rest = false;
    const j = rng.int(cells.length);
    cells[j].accent = !cells[j].accent;
    return { cells };
  },
  substitute(m, rng) {
    const cells = m.cells.map((c) => ({ ...c }));
    const i = rng.int(cells.length);
    cells[i].deg = Math.max(-9, Math.min(9, cells[i].deg + rng.sign() * (1 + rng.int(3))));
    return { cells };
  },
  octaveDisplace(m, rng) {
    const cells = m.cells.map((c) => ({ ...c }));
    const i = rng.int(cells.length);
    const scaleSteps = 7 * rng.sign();
    cells[i].deg = Math.max(-14, Math.min(14, cells[i].deg + scaleSteps));
    return { cells };
  },
};

const OP_NAMES = Object.keys(OPS);

// Вес операции зависит от силы мутации: слабая мутация — мягкие правки,
// сильная — структурные (инверсия, ракоход, октавные смещения).
function opWeights(amount) {
  return [
    0.9 + 0.3 * amount,        // transpose
    0.10 + 0.85 * amount,      // invert
    0.08 + 0.80 * amount,      // retrograde
    0.75 + 0.35 * amount,      // rhythmicMutation
    1.0,                       // substitute
    0.15 + 0.70 * amount,      // octaveDisplace
  ];
}

export function mutateMotif(motif, rng, amount) {
  const count = 1 + Math.floor(amount * 2.6); // 1..3 операции
  let cur = { cells: motif.cells.map((c) => ({ ...c })) };
  const applied = [];
  for (let i = 0; i < count; i++) {
    const name = OP_NAMES[rng.weighted(opWeights(amount))];
    cur = OPS[name](cur, rng);
    applied.push(name);
  }
  return {
    kind: 'motif',
    cells: cur.cells,
    lastOps: applied,
    describe: motif.describe,
  };
}

export { OP_NAMES };
