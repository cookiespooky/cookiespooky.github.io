// Мелодия: наложение контура мотива на ритмическую сетку с последующим
// «притяжением» к аккорду. Randomness управляет не выбором ноты напрямую,
// а вероятностью отклониться от текущего мотива; Tension — долей неаккордовых
// и хроматических тонов.

import { degreeToMidi, snapToPitchClasses, scaleOf } from './scales.js';

const CENTER = 72; // C5

function foldToRange(midi, lo, hi) {
  let m = midi;
  let guard = 0;
  while (m > hi && guard++ < 12) m -= 12;
  while (m < lo && guard++ < 12) m += 12;
  return Math.max(lo - 12, Math.min(hi + 12, m));
}

export function realizeBar(ctx) {
  const {
    rng, motif, rhythm, chord, params, tension, bar, cursor, attractor,
    keyPc, scaleId,
  } = ctx;

  const intervals = scaleOf(scaleId).intervals;
  const randomness = params.randomness / 100;
  const repetition = params.repetition / 100;
  const span = 7 + (params.range / 100) * 29;
  const lo = Math.round(CENTER - span / 2);
  const hi = Math.round(CENTER + span / 2);

  const onsets = rhythm.onsets(bar);

  // Repetition: буквальный повтор предыдущего такта, если он совпадает по числу нот.
  if (cursor.lastNotes && cursor.lastNotes.length === onsets.length && rng.bool(repetition * 0.85)) {
    const notes = cursor.lastNotes.map((n, i) => ({
      ...n,
      beat: onsets[i].beat,
      accent: onsets[i].accent,
    }));
    return { notes, repeated: true };
  }

  // Смещение позиции мотива: при высокой repetition чаще начинаем с того же места.
  if (!rng.bool(repetition * 0.7)) cursor.motifPos += onsets.length;

  const notes = [];
  let prev = cursor.prevMidi;

  for (let i = 0; i < onsets.length; i++) {
    const on = onsets[i];
    const cell = motif.cells[((cursor.motifPos + i) % motif.cells.length + motif.cells.length) % motif.cells.length];
    if (cell.rest) continue;

    const a = attractor.next();            // 0..1 — структурированная случайность
    const dev = (a - 0.5) * 2;             // -1..1

    let deg = cell.deg;

    // Отклонение от мотива. Его вероятность — это и есть Randomness.
    if (rng.bool(randomness * 0.55)) {
      const leap = rng.bool(0.15 + randomness * 0.5);
      deg += Math.round(dev * (leap ? 2 + randomness * 4 : 1));
    }

    let midi = degreeToMidi(keyPc, intervals, deg, 5);

    // Выбор класса тона. Взвешивание, а не бросок монетки.
    const wChord = 0.9 + 2.2 * (1 - tension) * (1 - 0.45 * randomness);
    const wScale = 0.30 + 0.85 * randomness + 0.45 * tension;
    const wNonChord = 0.01 + tension * tension * 1.5 + randomness * 0.12;
    const choice = rng.weighted([wChord, wScale, wNonChord]);

    if (choice === 0) {
      midi = snapToPitchClasses(midi, chord.pcs);
    } else if (choice === 2) {
      // Хроматический сосед в сторону ближайшего аккордового тона —
      // получается проходящий/вспомогательный, а не случайный полутон.
      const target = snapToPitchClasses(midi, chord.pcs);
      midi += target > midi ? -1 : 1;
    }

    // При низкой Randomness подтягиваем к плавному голосоведению.
    if (prev != null && Math.abs(midi - prev) > 4 && rng.bool((1 - randomness) * 0.6)) {
      const near = prev + Math.sign(midi - prev) * (1 + rng.int(3));
      midi = snapToPitchClasses(near, choice === 0 ? chord.pcs : pcsOfScale(keyPc, intervals));
    }

    midi = foldToRange(midi, lo, hi);

    const nextBeat = i + 1 < onsets.length ? onsets[i + 1].beat : 4;
    const maxDur = Math.max(rhythm.stepBeats * 0.5, nextBeat - on.beat);
    const dur = maxDur * (0.55 + rng.next() * 0.45);

    const vel = (on.accent || cell.accent ? 0.95 : 0.68) * (0.8 + tension * 0.25);

    notes.push({ beat: on.beat, dur, midi, vel, accent: on.accent });
    prev = midi;
  }

  // Совпадение пауз мотива с редким ритмом иногда обнуляет такт целиком.
  // Если в такте есть онсеты, хотя бы один из них должен зазвучать.
  if (!notes.length && onsets.length) {
    const on = onsets[0];
    const midi = foldToRange(snapToPitchClasses(degreeToMidi(keyPc, intervals, 0, 5), chord.pcs), lo, hi);
    notes.push({ beat: on.beat, dur: rhythm.stepBeats, midi, vel: 0.7, accent: on.accent });
    prev = midi;
  }

  cursor.prevMidi = prev;
  cursor.lastNotes = notes.map((n) => ({ ...n }));
  return { notes, repeated: false };
}

function pcsOfScale(keyPc, intervals) {
  return intervals.map((i) => ((keyPc + i) % 12 + 12) % 12);
}
