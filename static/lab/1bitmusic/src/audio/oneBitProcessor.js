// 1-BIT SYNTHESIS ENGINE
//
// Здесь нет сложения сигналов. На каждый сэмпл процессор принимает ровно одно
// решение: выдать 1 или 0. Полифония получается не микшированием, а
// планированием импульсов во времени — voice scheduling. Каждый голос просит
// импульс, когда доходит его период; шина отдаёт биту значение 1, если импульс
// попросил хотя бы один голос. Совпадения импульсов — это не баг, а физика
// одного бита: голоса действительно борются за один выход, и характерное
// интермодуляционное «зерно» и есть звук этой борьбы.
//
// Выход буквально двузначен: output[i] ∈ {0, gain}. Постоянной составляющей
// это добавляет ~1–5% от gain, что динамик отсекает сам, — поэтому никакого
// фильтра после кодера нет, иначе поток перестал бы быть однобитным.

const MAX_VOICES = 8;
const BITS_PER_MESSAGE = 2048; // ~43 мс при 48 кГц

// Тембр голоса задаётся шириной импульса в сэмплах — единственный
// доступный однобитному синтезу параметр «громкости».
// Ширина импульса работает как фильтр нижних частот: у прямоугольника
// шириной w первый ноль спектра лежит на fs/w. Узкий импульс даёт почти
// плоский спектр до Найквиста — десятки гармоник на голос, которые забивают
// критические полосы и дают ту самую шероховатость. Значения подобраны
// измерением сенсорной шероховатости по Сетаресу, а не на слух.
const VOICE_SHAPE = {
  bass: { width: 6.0, attack: 0.004, release: 0.05, sustain: 0.85 },
  harm: { width: 9.0, attack: 0.010, release: 0.09, sustain: 0.70 },
  lead: { width: 7.0, attack: 0.002, release: 0.04, sustain: 0.80 },
  // Для измерений: огибающая ровная (sustain = 1), чтобы поток был строго
  // периодическим и период повторения можно было измерить, а не оценить.
  test: { width: 7.0, attack: 0.001, release: 0.01, sustain: 1.0 },
};

const METHOD = { pinpulse: 0, pwm: 1, xor: 2 };

// Методы дают очень разную скважность (pin pulse ~3%, PWM ~60%), поэтому без
// выравнивания переключение метода било бы по ушам. Уровень — константа на
// метод, так что выход остаётся ровно двузначным: {0, gain * level}.
const METHOD_LEVEL = [1.0, 0.30, 0.38];

class Voice {
  constructor() {
    this.active = false;
    this.acc = 0; this.period = 100; this.pulse = 0;
    this.env = 0; this.stage = 'off';
    this.width = 1; this.vel = 1;
    this.glide = false; this.period0 = 100; this.period1 = 100; this.startFrame = 0;
    this.attInc = 0.01; this.relCoef = 0.999; this.sustain = 0.8; this.decCoef = 0.9999;
    this.endFrame = 0; this.kind = 'lead';
  }
}

class OneBitProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'gain', defaultValue: 0.55, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'pulseDensity', defaultValue: 1, minValue: 0.15, maxValue: 3, automationRate: 'k-rate' },
      { name: 'jitter', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'noise', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ];
  }

  constructor(options) {
    super();
    this.voices = Array.from({ length: MAX_VOICES }, () => new Voice());
    this.queue = [];
    this.method = METHOD.pinpulse;

    this.packed = new Uint8Array(BITS_PER_MESSAGE / 8);
    this.bitIndex = 0;
    this.onesInPacket = 0;

    this.rndState = 22222;

    // Дробная часть ширины импульса разыгрывается случайно: так затухание
    // звучит как шумовое зерно, а не падает на субгармонику. Но случайность
    // делает поток недетерминированным в мелких деталях, и точный период
    // повторения измерить нельзя. Режим 'error' заменяет её накоплением
    // ошибки — тот же дизеринг, только детерминированный.
    this.dither = 'random';

    // Мастер-уровень живёт в битовой области: он масштабирует ШИРИНУ
    // импульсов, а не амплитуду. Поэтому выход остаётся строго двузначным
    // даже во время фейда — фильтра после кодера по-прежнему нет.
    this.master = 1;
    this.masterTarget = 1;
    this.masterStep = 1;

    this.port.onmessage = (e) => this.onMessage(e.data);

    // Офлайн-рендер отдаёт всю дорожку здесь, а не через port. postMessage
    // доставляется асинхронно и в OfflineAudioContext успевает не всегда:
    // рендер стартует мгновенно и может закончиться раньше, чем сообщение
    // дойдёт до процессора, — получается тишина. processorOptions приходят
    // в конструктор синхронно, и гонки не существует.
    const po = (options && options.processorOptions) || {};
    if (po.method) this.method = METHOD[po.method] ?? METHOD.pinpulse;
    if (po.dither) this.dither = po.dither;
    if (po.master !== undefined) { this.master = this.masterTarget = po.master; }
    if (po.events) this.enqueue(po.events);
  }

  enqueue(events) {
    for (const ev of events) {
      this.queue.push({
        startFrame: Math.round(ev.startTime * sampleRate),
        endFrame: Math.round(ev.endTime * sampleRate),
        // freq имеет приоритет над midi: чистый строй не ложится на
        // двенадцатиступенную сетку, его частоты приходится задавать прямо.
        freq: ev.freq !== undefined ? ev.freq : 440 * Math.pow(2, (ev.midi - 69) / 12),
        // freqTo включает глиссандо: частота едет линейно от freq к freqTo за
        // время ноты. Нужно для градиента — иначе траекторию пришлось бы резать
        // на куски и перезапускать огибающую на каждом шаге.
        freqTo: ev.freqTo,
        vel: ev.vel, kind: ev.kind,
      });
    }
    this.queue.sort((a, b) => a.startFrame - b.startFrame);
  }

  rnd() {
    this.rndState = (Math.imul(this.rndState, 1664525) + 1013904223) | 0;
    return (this.rndState >>> 8) / 16777216;
  }

  onMessage(msg) {
    if (msg.type === 'notes') {
      this.enqueue(msg.events);
    } else if (msg.type === 'method') {
      this.method = METHOD[msg.method] ?? METHOD.pinpulse;
    } else if (msg.type === 'dither') {
      this.dither = msg.dither;
    } else if (msg.type === 'master') {
      // Фейд в битовой области: ширина импульсов едет к цели за fadeMs.
      this.masterTarget = Math.max(0, Math.min(1.5, msg.value));
      const frames = Math.max(1, (msg.fadeMs || 25) * 0.001 * sampleRate);
      this.masterStep = Math.abs(this.masterTarget - this.master) / frames;
      if (this.masterStep <= 0) this.masterStep = 1;
    } else if (msg.type === 'reset') {
      this.queue.length = 0;
      for (const v of this.voices) { v.active = false; v.stage = 'off'; v.env = 0; v.pulse = 0; }
    }
  }

  allocate() {
    for (const v of this.voices) if (!v.active) return v;
    let worst = this.voices[0];
    for (const v of this.voices) if (v.env < worst.env) worst = v;
    return worst;
  }

  startNote(ev) {
    const v = this.allocate();
    const freq = ev.freq;
    const shape = VOICE_SHAPE[ev.kind] || VOICE_SHAPE.lead;

    v.active = true;
    v.period = Math.max(2, sampleRate / freq);
    v.glide = ev.freqTo !== undefined && ev.freqTo !== ev.freq;
    v.period0 = v.period;
    v.period1 = v.glide ? Math.max(2, sampleRate / ev.freqTo) : v.period;
    v.startFrame = ev.startFrame;
    // Разводим фазы голосов, иначе импульсы слипаются и полифония
    // схлопывается в один тембр.
    v.acc = this.rnd() * v.period;
    v.pulse = 0;
    v.env = 0;
    v.widthAcc = 0;
    v.stage = 'attack';
    v.vel = ev.vel;
    v.width = shape.width;
    v.kind = ev.kind;
    v.sustain = shape.sustain;
    v.attInc = 1 / Math.max(1, shape.attack * sampleRate);
    v.decCoef = Math.exp(-1 / (0.35 * sampleRate));
    v.relCoef = Math.exp(-1 / Math.max(1, shape.release * sampleRate));
    v.endFrame = ev.endFrame;
  }

  process(_inputs, outputs, parameters) {
    const out = outputs[0][0];
    if (!out) return true;

    const len = out.length;
    const gain = parameters.gain[0];
    const pd = parameters.pulseDensity[0];
    const jitter = parameters.jitter[0];
    const noise = parameters.noise[0];
    const voices = this.voices;
    const method = this.method;
    const base = currentFrame;
    const level = gain * METHOD_LEVEL[method];

    for (let i = 0; i < len; i++) {
      const frame = base + i;

      while (this.queue.length && this.queue[0].startFrame <= frame) {
        this.startNote(this.queue.shift());
      }

      let bit = 0;

      // Мастер едет к цели по одному шагу на сэмпл.
      if (this.master !== this.masterTarget) {
        const d = this.masterTarget - this.master;
        this.master = Math.abs(d) <= this.masterStep ? this.masterTarget
          : this.master + Math.sign(d) * this.masterStep;
      }
      const mv = this.master;

      for (let vi = 0; vi < MAX_VOICES; vi++) {
        const v = voices[vi];
        if (!v.active) continue;

        // Огибающая. Конец ноты обрывает и атаку тоже — иначе очень короткая
        // нота залипала бы до конца атаки и наезжала на следующую.
        if (v.stage !== 'release' && frame >= v.endFrame) v.stage = 'release';
        if (v.stage === 'attack') {
          v.env += v.attInc;
          if (v.env >= 1) { v.env = 1; v.stage = 'decay'; }
        } else if (v.stage === 'decay') {
          v.env = v.sustain + (v.env - v.sustain) * v.decCoef;
        } else {
          v.env *= v.relCoef;
          if (v.env < 0.002) { v.active = false; v.stage = 'off'; v.pulse = 0; continue; }
        }

        if (v.glide) {
          const span = v.endFrame - v.startFrame;
          const k = span > 0 ? Math.min(1, Math.max(0, (frame - v.startFrame) / span)) : 1;
          v.period = v.period0 + (v.period1 - v.period0) * k;
        }

        const amp = v.env * v.vel * mv;

        if (method === METHOD.pinpulse) {
          v.acc += 1;
          if (v.acc >= v.period) {
            const jit = jitter ? 1 + (this.rnd() - 0.5) * jitter * 0.12 : 1;
            v.acc -= v.period * jit;
            // Ширина импульса — единственная «громкость», доступная одному биту.
            // Дробную часть разыгрываем случайно: получается шумовое затухание,
            // а не падение на субгармонику, как дало бы периодическое прореживание.
            const w = v.width * amp * pd;
            let n;
            if (this.dither === 'error') {
              // Накопление ошибки: детерминированно, поток строго периодичен.
              v.widthAcc += w;
              n = Math.floor(v.widthAcc);
              v.widthAcc -= n;
            } else {
              n = Math.floor(w);
              if (this.rnd() < w - n) n++;
            }
            if (n > 12) n = 12;
            v.pulse = n;
          }
          if (v.pulse > 0) { bit = 1; v.pulse--; }
        } else if (method === METHOD.pwm) {
          v.acc += 1;
          if (v.acc >= v.period) v.acc -= v.period;
          const duty = Math.min(0.48, 0.06 + 0.34 * amp * pd);
          if (v.acc < v.period * duty) bit = 1;
        } else { // xor: классическое «сложение» меандров одним битом
          v.acc += 1;
          if (v.acc >= v.period) v.acc -= v.period;
          if (amp > 0.06 && v.acc < v.period * 0.5) bit ^= 1;
        }
      }

      if (mv < 0.015) bit = 0;   // MUTE: тишина, а не приглушение
      if (noise > 0 && this.rnd() < noise * 0.04) bit ^= 1;

      out[i] = bit ? level : 0;

      // Захват настоящего потока для визуализации: пакуем по 8 бит в байт.
      if (bit) {
        this.packed[this.bitIndex >> 3] |= 0x80 >> (this.bitIndex & 7);
        this.onesInPacket++;
      }
      if (++this.bitIndex >= BITS_PER_MESSAGE) {
        const copy = this.packed.slice();
        this.port.postMessage(
          { type: 'bits', data: copy.buffer, count: BITS_PER_MESSAGE, ones: this.onesInPacket },
          [copy.buffer]
        );
        this.packed.fill(0);
        this.bitIndex = 0;
        this.onesInPacket = 0;
      }
    }

    // Моно на все каналы выхода.
    for (let c = 1; c < outputs[0].length; c++) outputs[0][c].set(out);
    return true;
  }
}

registerProcessor('one-bit-processor', OneBitProcessor);
