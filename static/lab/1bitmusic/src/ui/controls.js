// Декларативное описание панелей. Добавить параметр — дописать строку сюда.

import { NOTE_NAMES, SCALES, SCALE_IDS } from '../music/scales.js';
import { ATTRACTORS, ATTRACTOR_IDS } from '../music/attractors.js';

export const PANELS = [
  {
    id: 'harmony', title: 'HARMONY',
    controls: [
      { key: 'key', type: 'select', label: 'Key', options: NOTE_NAMES.map((n) => [n, n]) },
      { key: 'scale', type: 'select', label: 'Scale', options: SCALE_IDS.map((id) => [id, SCALES[id].name]) },
      { key: 'complexity', type: 'range', label: 'Complexity', hint: 'трезвучие → 7 → 9' },
      { key: 'tension', type: 'range', label: 'Tension', hint: 'доля неаккордовых тонов' },
      { key: 'memory', type: 'range', label: 'Memory', hint: 'влияние гармонической истории' },
      { key: 'voicing', type: 'select', label: 'Voicing',
        options: [['arp', 'ARPEGGIO'], ['struck', 'STRUCK'], ['pad', 'PAD']] },
    ],
  },
  {
    id: 'rhythm', title: 'RHYTHM',
    controls: [
      { key: 'density', type: 'range', label: 'Density' },
      { key: 'swing', type: 'range', label: 'Swing' },
      { key: 'subdivision', type: 'select', label: 'Subdivision', options: [[4, '1/4'], [8, '1/8'], [16, '1/16']], numeric: true },
      { key: 'patternLength', type: 'select', label: 'Pattern Length', options: [[1, '1 такт'], [2, '2 такта'], [4, '4 такта']], numeric: true },
      { key: 'syncopation', type: 'range', label: 'Syncopation' },
    ],
  },
  {
    id: 'melody', title: 'MELODY',
    controls: [
      { key: 'tempo', type: 'range', label: 'Tempo', min: 40, max: 180, unit: ' BPM' },
      { key: 'range', type: 'range', label: 'Range' },
      { key: 'repetition', type: 'range', label: 'Repetition' },
      { key: 'mutation', type: 'range', label: 'Mutation', hint: 'сила изменения при MUTATE' },
    ],
  },
  {
    id: 'generation', title: 'GENERATION',
    controls: [
      { key: 'randomness', type: 'range', label: 'Randomness', hint: 'deterministic → chaotic' },
      { key: 'humanize', type: 'range', label: 'Humanize' },
    ],
  },
  {
    id: 'experimental', title: 'EXPERIMENTAL',
    controls: [
      { key: 'attractor', type: 'select', label: 'Attractor', options: ATTRACTOR_IDS.map((id) => [id, ATTRACTORS[id].name]) },
      { key: 'tensionCurve', type: 'range', label: 'Tension Curve', hint: 'глубина CALM → TENSION → RELEASE' },
    ],
  },
  {
    id: 'synthesis', title: '1-BIT SYNTHESIS',
    controls: [
      { key: 'method', type: 'select', label: 'Method', options: [['pinpulse', 'PIN PULSE'], ['pwm', 'PWM'], ['xor', 'XOR SQUARES']] },
      { key: 'pulseDensity', type: 'range', label: 'Pulse Density' },
      { key: 'gain', type: 'range', label: 'Output' },
      { key: 'jitter', type: 'range', label: 'Jitter' },
      { key: 'noise', type: 'range', label: 'Noise' },
    ],
  },
];

export function buildPanels(root, params, onChange) {
  const refs = {};
  for (const panel of PANELS) {
    const section = document.createElement('section');
    section.className = 'panel';
    section.innerHTML = `<h2>${panel.title}</h2>`;

    for (const c of panel.controls) {
      const row = document.createElement('div');
      row.className = 'ctl';

      const label = document.createElement('label');
      label.textContent = c.label;
      label.title = c.hint || '';
      row.appendChild(label);

      let input;
      if (c.type === 'select') {
        input = document.createElement('select');
        for (const [value, text] of c.options) {
          const o = document.createElement('option');
          o.value = value; o.textContent = text;
          input.appendChild(o);
        }
        input.value = params[c.key];
        input.addEventListener('change', () => {
          onChange(c.key, c.numeric ? Number(input.value) : input.value);
        });
        row.appendChild(input);
      } else {
        input = document.createElement('input');
        input.type = 'range';
        input.min = c.min ?? 0;
        input.max = c.max ?? 100;
        input.step = 1;
        input.value = params[c.key];
        const readout = document.createElement('span');
        readout.className = 'val';
        readout.textContent = params[c.key] + (c.unit || '');
        input.addEventListener('input', () => {
          const v = Number(input.value);
          readout.textContent = v + (c.unit || '');
          onChange(c.key, v);
        });
        row.appendChild(input);
        row.appendChild(readout);
        refs[c.key] = { input, readout, unit: c.unit || '' };
      }
      if (!refs[c.key]) refs[c.key] = { input };
      section.appendChild(row);
    }
    root.appendChild(section);
  }
  return refs;
}

// Синхронизация виджетов после LOAD STATE.
export function syncPanels(refs, params) {
  for (const [key, ref] of Object.entries(refs)) {
    if (params[key] === undefined) continue;
    ref.input.value = params[key];
    if (ref.readout) ref.readout.textContent = params[key] + ref.unit;
  }
}
