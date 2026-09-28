// Лады и перевод ступеней в MIDI. Реестр расширяемый: добавить лад —
// добавить строчку в SCALES.

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALES = {
  major:         { name: 'Major',          intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor:         { name: 'Natural Minor',  intervals: [0, 2, 3, 5, 7, 8, 10] },
  dorian:        { name: 'Dorian',         intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian:      { name: 'Phrygian',       intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian:        { name: 'Lydian',         intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian:    { name: 'Mixolydian',     intervals: [0, 2, 4, 5, 7, 9, 10] },
  harmonicMinor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11] },
  // У пентатоники нет семи ступеней для построения терцовых аккордов,
  // поэтому гармония строится по родительскому ладу, а мелодия остаётся в пентатонике.
  pentatonic:    { name: 'Pentatonic',     intervals: [0, 3, 5, 7, 10], harmonyParent: 'minor' },
};

export const SCALE_IDS = Object.keys(SCALES);

export function scaleOf(id) {
  return SCALES[id] || SCALES.minor;
}

// Семиступенный лад, по которому строятся аккорды.
export function harmonyIntervals(id) {
  const s = scaleOf(id);
  return s.harmonyParent ? scaleOf(s.harmonyParent).intervals : s.intervals;
}

// Ступень -> MIDI. degree может быть любым целым, октавы разворачиваются сами.
export function degreeToMidi(rootPc, intervals, degree, octave = 4) {
  const n = intervals.length;
  const oct = Math.floor(degree / n);
  const idx = ((degree % n) + n) % n;
  return 12 * (octave + 1 + oct) + rootPc + intervals[idx];
}

export function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

export function midiName(m) {
  return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
}

// Ближайший MIDI с одним из разрешённых классов высоты.
export function snapToPitchClasses(midi, pcs) {
  if (!pcs.length) return midi;
  let best = midi, bestDist = Infinity;
  for (let d = -6; d <= 6; d++) {
    const cand = midi + d;
    const pc = ((cand % 12) + 12) % 12;
    if (pcs.indexOf(pc) === -1) continue;
    const dist = Math.abs(d) + (d < 0 ? 0.1 : 0); // при равенстве тянем вверх
    if (dist < bestDist) { bestDist = dist; best = cand; }
  }
  return best;
}
