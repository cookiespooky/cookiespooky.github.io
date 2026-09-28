// Аудиодвижок: AudioContext, воркет и планировщик с упреждением.
//
// Музыкальная логика живёт в главном потоке и раз в 25 мс отправляет в воркет
// события на 300 мс вперёд с абсолютными временами. Воркет пересчитывает их в
// сэмплы, поэтому ноты попадают точно в свой сэмпл и не зависят от джиттера
// таймера страницы.

const LOOKAHEAD = 0.3;   // на сколько секунд вперёд планируем
const TICK_MS = 25;

export class AudioEngine {
  constructor(generator) {
    this.generator = generator;
    this.ctx = null;
    this.node = null;
    this.playing = false;
    this.timer = null;
    this.nextBarTime = 0;
    this.onBar = null;
    this.onBits = null;
    this.masterValue = 1;
    this.muted = false;
  }

  async init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx({ latencyHint: 'interactive' });
    await this.ctx.audioWorklet.addModule('./src/audio/oneBitProcessor.js');
    this.node = new AudioWorkletNode(this.ctx, 'one-bit-processor', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    // Между кодером и динамиком нет ни одного узла, который мог бы вернуть
    // сигналу многобитность. AnalyserNode пропускает вход на выход байт в байт
    // и только читает его, поэтому анализатор спектра стоит прямо в тракте.
    this.analyser = this.ctx.createAnalyser();
    // Однобитный сигнал широкополосный по своей природе: узкий импульс — это
    // почти плоский спектр. Чтобы на этом фоне были видны сами ноты, нужен
    // мелкий шаг по частоте и растянутый динамический диапазон, иначе
    // анализатор показывает ровную стену.
    this.analyser.fftSize = 4096;
    this.analyser.minDecibels = -92;
    this.analyser.maxDecibels = -28;
    this.analyser.smoothingTimeConstant = 0.6;
    this.node.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.node.port.onmessage = (e) => {
      if (e.data.type === 'bits' && this.onBits) {
        this.onBits(new Uint8Array(e.data.data), e.data.count, e.data.ones);
      }
    };
    this.pushParams();
  }

  pushParams() {
    if (!this.node) return;
    const p = this.generator.params;
    // Именно setValueAtTime, а не плавная подстройка: во время рампы уровня
    // на выходе на долю секунды появились бы промежуточные значения, и сигнал
    // формально перестал бы быть двузначным. Щелчок при повороте ручки для
    // однобитного прибора уместнее, чем нарушение его главного свойства.
    const set = (name, value) => {
      const ap = this.node.parameters.get(name);
      if (ap) ap.setValueAtTime(value, this.ctx.currentTime);
    };
    set('gain', p.gain / 100);
    set('pulseDensity', 0.2 + (p.pulseDensity / 100) * 1.6); // 50 -> 1.0, нейтраль
    set('jitter', p.jitter / 100);
    set('noise', p.noise / 100);
    this.node.port.postMessage({ type: 'method', method: p.method });
  }

  // Мастер-уровень и фейды — в битовой области: воркет масштабирует ширину
  // импульсов, поэтому выход остаётся строго двузначным даже во время фейда.
  // Постфильтра (DC blocker, лимитер) в тракте нет и быть не должно: сигнал
  // и так ограничен по построению, он физически не может выйти за {0, gain}.
  setMaster(value, fadeMs = 25) {
    this.masterValue = value;
    if (this.node) this.node.port.postMessage({ type: 'master', value: this.muted ? 0 : value, fadeMs });
  }

  setMuted(muted) {
    this.muted = muted;
    this.setMaster(this.masterValue ?? 1, 20);
  }

  async start() {
    await this.init();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.node.port.postMessage({ type: 'reset' });
    this.node.port.postMessage({ type: 'master', value: 0, fadeMs: 0 });
    this.setMaster(this.masterValue ?? 1, 40);   // fade-in
    this.nextBarTime = this.ctx.currentTime + 0.12;
    this.tick();
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    clearInterval(this.timer);
    this.timer = null;
    if (!this.node) return;
    // fade-out, и только потом сброс очереди — иначе щелчок на обрыве.
    this.node.port.postMessage({ type: 'master', value: 0, fadeMs: 40 });
    const node = this.node;
    setTimeout(() => node.port.postMessage({ type: 'reset' }), 80);
  }

  async toggle() {
    if (this.playing) this.stop(); else await this.start();
    return this.playing;
  }

  tick() {
    if (!this.playing) return;
    const horizon = this.ctx.currentTime + LOOKAHEAD;
    let guard = 0;
    while (this.nextBarTime < horizon && guard++ < 8) {
      const bar = this.generator.nextBar();
      const spb = 60 / bar.tempo;
      const events = bar.events.map((e) => ({
        startTime: this.nextBarTime + e.t * spb,
        endTime: this.nextBarTime + (e.t + e.dur) * spb,
        midi: e.midi, vel: e.vel, kind: e.kind,
      }));
      this.node.port.postMessage({ type: 'notes', events });
      this.nextBarTime += bar.beats * spb;
      if (this.onBar) this.onBar(bar, this.nextBarTime);
    }
  }
}

// --- Офлайн-рендер и экспорт ------------------------------------------

// Рендер произвольного списка событий через тот же воркет. Это же используют
// и экспорт, и растровый эксперимент, поэтому картинка и звук получаются из
// одного объекта, а не из двух похожих алгоритмов.
export async function renderEvents(events, seconds, opts = {}) {
  const {
    sampleRate = 48000, method = 'pinpulse', dither = 'random',
    gain = 0.6, pulseDensity = 1, jitter = 0, noise = 0,
    modulePath = './src/audio/oneBitProcessor.js',
  } = opts;
  const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OfflineCtx(1, Math.ceil(seconds * sampleRate), sampleRate);
  await ctx.audioWorklet.addModule(modulePath);

  const node = new AudioWorkletNode(ctx, 'one-bit-processor', {
    numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1],
    processorOptions: { events, method, dither, master: 1 },
  });
  node.connect(ctx.destination);
  node.parameters.get('gain').value = gain;
  node.parameters.get('pulseDensity').value = pulseDensity;
  node.parameters.get('jitter').value = jitter;
  node.parameters.get('noise').value = noise;

  const buffer = await ctx.startRendering();
  return buffer.getChannelData(0);
}

// Рендер идёт через тот же воркет в OfflineAudioContext, поэтому экспорт —
// это буквально то же самое, что слышно в реальном времени, а не второй
// алгоритм, который «должен» совпадать.
export async function renderOffline(generator, seconds, sampleRate = 48000) {
  // Планируем всю дорожку заранее — офлайн-контекст не имеет реального времени.
  const p = generator.params;
  let t = 0.05;
  const events = [];
  while (t < seconds) {
    const bar = generator.nextBar();
    const spb = 60 / bar.tempo;
    for (const e of bar.events) {
      const start = t + e.t * spb;
      if (start >= seconds) continue;
      events.push({ startTime: start, endTime: Math.min(seconds, start + e.dur * spb), midi: e.midi, vel: e.vel, kind: e.kind });
    }
    t += bar.beats * spb;
  }

  return renderEvents(events, seconds, {
    sampleRate,
    method: p.method,
    gain: p.gain / 100,
    pulseDensity: 0.2 + (p.pulseDensity / 100) * 1.6,
    jitter: p.jitter / 100,
    noise: p.noise / 100,
  });
}

// Восстановление битов из отрендеренного сигнала. Работает только потому,
// что сигнал действительно двузначен — это и есть проверка однобитности.
export function extractBits(samples) {
  let maxV = 0;
  for (let i = 0; i < samples.length; i++) if (samples[i] > maxV) maxV = samples[i];
  const threshold = maxV / 2;
  const bits = new Uint8Array(samples.length);
  const seen = new Set();
  for (let i = 0; i < samples.length; i++) {
    bits[i] = samples[i] > threshold ? 1 : 0;
    if (seen.size < 8) seen.add(Math.round(samples[i] * 1e6));
  }
  return { bits, distinctLevels: seen.size, high: maxV };
}

export function packBits(bits) {
  const out = new Uint8Array(Math.ceil(bits.length / 8));
  for (let i = 0; i < bits.length; i++) if (bits[i]) out[i >> 3] |= 0x80 >> (i & 7);
  return out;
}

// 8-битный PCM WAV, в котором у каждого сэмпла ровно два возможных значения.
export function bitsToWav(bits, sampleRate) {
  const dataLen = bits.length;
  const buf = new ArrayBuffer(44 + dataLen);
  const dv = new DataView(buf);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); dv.setUint32(4, 36 + dataLen, true); str(8, 'WAVE');
  str(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true); dv.setUint32(24, sampleRate, true);
  dv.setUint32(28, sampleRate, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true);
  str(36, 'data'); dv.setUint32(40, dataLen, true);
  const bytes = new Uint8Array(buf, 44);
  for (let i = 0; i < dataLen; i++) bytes[i] = bits[i] ? 255 : 0;
  return new Blob([buf], { type: 'audio/wav' });
}
