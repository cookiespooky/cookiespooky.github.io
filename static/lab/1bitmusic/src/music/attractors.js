// Аттракторы: источники «структурированной случайности». Каждый выдаёт
// значение 0..1, которое управляет тем, насколько мелодия отклоняется от
// мотива и в какую сторону. Разница между ними слышна как разный характер
// блуждания, а не как разная громкость шума.
//
// Добавить свой генератор — дописать запись в ATTRACTORS.

export const ATTRACTORS = {
  off: {
    name: 'OFF',
    create: () => ({ next: () => 0.5 }),
  },

  walk: {
    name: 'RANDOM WALK',
    create: (rng, amount) => {
      let v = 0.5;
      const step = 0.06 + amount * 0.22;
      return {
        next() {
          v += rng.gauss() * step;
          if (v < 0) v = -v;                 // отражение от границ,
          if (v > 1) v = 2 - v;              // чтобы не залипать в краях
          return v;
        },
      };
    },
  },

  markov: {
    name: 'MARKOV',
    create: (rng, amount) => {
      const states = [0.0, 0.25, 0.5, 0.75, 1.0];
      let s = 2;
      // Чем выше amount, тем охотнее цепь прыгает через состояния.
      return {
        next() {
          const w = states.map((_, i) => {
            const d = Math.abs(i - s);
            if (d === 0) return 0.9 - 0.5 * amount;
            return Math.pow(0.45 + 0.4 * amount, d);
          });
          s = rng.weighted(w);
          return states[s];
        },
      };
    },
  },

  logistic: {
    name: 'LOGISTIC MAP',
    create: (rng, amount) => {
      // r ниже 3.57 — периодические орбиты, выше — детерминированный хаос.
      const r = 3.2 + amount * 0.795;
      let x = 0.2 + rng.next() * 0.6;
      return {
        next() {
          x = r * x * (1 - x);
          if (x <= 0 || x >= 1 || !isFinite(x)) x = 0.5;
          return x;
        },
      };
    },
  },
};

export const ATTRACTOR_IDS = Object.keys(ATTRACTORS);

export function createAttractor(id, rng, amount) {
  const a = ATTRACTORS[id] || ATTRACTORS.off;
  return a.create(rng, amount);
}
