// Визуализация показывает тот самый поток, который идёт в динамик:
// биты приходят из воркета пакетами по 2048, ничего не пересчитывается
// и не сглаживается.

const RING_BITS = 16384;

export class Visualizer {
  constructor({ scope, spectrum, stream, duty }) {
    this.scopeCanvas = scope;
    this.spectrumCanvas = spectrum;
    this.streamEl = stream;
    this.dutyEl = duty;

    this.ring = new Uint8Array(RING_BITS);
    this.head = 0;
    this.total = 0;
    this.ones = 0;
    this.analyser = null;
    this.freqData = null;
    this.running = false;
  }

  attachAnalyser(analyser, sampleRate) {
    this.analyser = analyser;
    this.sampleRate = sampleRate;
    this.freqData = new Uint8Array(analyser.frequencyBinCount);
  }

  pushBits(packed, count) {
    for (let i = 0; i < count; i++) {
      const bit = (packed[i >> 3] >> (7 - (i & 7))) & 1;
      this.ring[this.head] = bit;
      this.head = (this.head + 1) % RING_BITS;
    }
    this.total = Math.min(RING_BITS, this.total + count);
  }

  // Последние n бит в хронологическом порядке.
  recent(n) {
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      out[n - 1 - i] = this.ring[(this.head - 1 - i + RING_BITS * 2) % RING_BITS];
    }
    return out;
  }

  start() { if (!this.running) { this.running = true; this.loop(); } }
  stop() { this.running = false; }

  loop() {
    if (!this.running) return;
    this.drawScope();
    this.drawSpectrum();
    this.drawStream();
    requestAnimationFrame(() => this.loop());
  }

  fit(canvas) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  drawScope() {
    const { ctx, w, h } = this.fit(this.scopeCanvas);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#07090b';
    ctx.fillRect(0, 0, w, h);

    const n = Math.min(1400, Math.floor(w * 2));
    const bits = this.recent(n);
    const top = h * 0.18, bottom = h * 0.82;

    // Уровни 0 и 1 — пунктиром, чтобы было видно, что промежуточных нет.
    ctx.strokeStyle = '#1a2128';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(0, top); ctx.lineTo(w, top);
    ctx.moveTo(0, bottom); ctx.lineTo(w, bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#4fe08a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const dx = w / n;
    let py = bits[0] ? top : bottom;
    ctx.moveTo(0, py);
    for (let i = 0; i < n; i++) {
      const x = i * dx;
      const y = bits[i] ? top : bottom;
      if (y !== py) { ctx.lineTo(x, py); ctx.lineTo(x, y); py = y; }
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, py);
    ctx.stroke();

    ctx.fillStyle = '#3a4650';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText('1', 4, top - 4);
    ctx.fillText('0', 4, bottom + 12);
  }

  drawSpectrum() {
    if (!this.analyser) return;
    const { ctx, w, h } = this.fit(this.spectrumCanvas);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#07090b';
    ctx.fillRect(0, 0, w, h);
    this.analyser.getByteFrequencyData(this.freqData);

    // Только нижние ~2 кГц: там лежат основные тоны нот. Выше — их гармоники,
    // которых у однобитного сигнала бесконечно много и которые всё заслоняют.
    const bins = Math.max(16, Math.round(2000 / (this.sampleRate / 2) * this.freqData.length));
    const bw = w / bins;
    for (let i = 0; i < bins; i++) {
      const v = this.freqData[i] / 255;
      const bh = v * h;
      ctx.fillStyle = `rgb(${40 + v * 100}, ${140 + v * 100}, ${90 + v * 60})`;
      ctx.fillRect(i * bw, h - bh, Math.max(1, bw - 0.5), bh);
    }
  }

  drawStream() {
    const chars = Math.max(40, Math.floor(this.streamEl.clientWidth / 7.1)) * 3;
    const bits = this.recent(chars);
    let s = '';
    for (let i = 0; i < chars; i++) s += bits[i] ? '1' : '0';
    this.streamEl.textContent = s;
    // Скважность считается по кольцу (последние ~0.34 с), а не за всю сессию:
    // иначе индикатор не реагирует на MUTE и MASTER.
    if (this.total > 0) {
      let ones = 0;
      for (let i = 0; i < this.total; i++) ones += this.ring[i];
      this.dutyEl.textContent = `DUTY ${(100 * ones / this.total).toFixed(2)}%`;
    }
  }
}
