// Procedural Web Audio API foley & 116 BPM disco loop for Ramsés Mania.
// Lazy-initialized only on user gesture; respects mute state and cleans up on unmount.

export type ComicSfxKind =
  | "crown"
  | "purr"
  | "valve"
  | "crash"
  | "sunbeam"
  | "beat"
  | "ascend"
  | "pop"
  | "whoosh";

let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;
let muted = false;
let discoTimer: number | null = null;
let discoStep = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function getNoiseBuffer(ac: AudioContext): AudioBuffer {
  if (noiseBuf && noiseBuf.sampleRate === ac.sampleRate) {
    return noiseBuf;
  }
  const len = Math.floor(ac.sampleRate * 1.2);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  noiseBuf = buf;
  return buf;
}

export function setRamsesMuted(nextMuted: boolean) {
  muted = nextMuted;
  if (muted) {
    toggleDiscoLoop(false);
  }
}

export function isRamsesMuted(): boolean {
  return muted;
}

export function toggleDiscoLoop(on: boolean) {
  if (typeof window === "undefined") return;
  if (!on || muted) {
    if (discoTimer !== null) {
      window.clearInterval(discoTimer);
      discoTimer = null;
    }
    return;
  }
  if (discoTimer !== null) return;

  const bassPattern = [110, 0, 110, 130.81, 146.83, 0, 164.81, 146.83];
  const stepMs = Math.round((60 / 116 / 2) * 1000); // ~258ms eighth notes at 116 BPM
  discoStep = 0;

  const fireStep = () => {
    if (muted) return;
    const ac = getCtx();
    if (!ac) return;
    const now = ac.currentTime;
    const step = discoStep % 8;
    discoStep += 1;

    // Four-on-the-floor kick on even 8th notes
    if (step % 2 === 0) {
      const kOsc = ac.createOscillator();
      const kGain = ac.createGain();
      kOsc.type = "sine";
      kOsc.frequency.setValueAtTime(145, now);
      kOsc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
      kGain.gain.setValueAtTime(0.24, now);
      kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      kOsc.connect(kGain).connect(ac.destination);
      kOsc.start(now);
      kOsc.stop(now + 0.17);
    }

    // Crisp offbeat disco hi-hat
    if (step % 2 === 1) {
      const hSrc = ac.createBufferSource();
      hSrc.buffer = getNoiseBuffer(ac);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(6800, now);
      const hGain = ac.createGain();
      hGain.gain.setValueAtTime(0.08, now);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      hSrc.connect(hp).connect(hGain).connect(ac.destination);
      hSrc.start(now);
      hSrc.stop(now + 0.075);
    }

    // Punchy octave disco synth bassline
    const freq = bassPattern[step];
    if (freq > 0) {
      const bOsc = ac.createOscillator();
      const lp = ac.createBiquadFilter();
      const bGain = ac.createGain();
      bOsc.type = "sawtooth";
      bOsc.frequency.setValueAtTime(freq, now);
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(980, now);
      lp.frequency.exponentialRampToValueAtTime(280, now + 0.18);
      bGain.gain.setValueAtTime(0.11, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
      bOsc.connect(lp).connect(bGain).connect(ac.destination);
      bOsc.start(now);
      bOsc.stop(now + 0.22);
    }
  };

  fireStep();
  discoTimer = window.setInterval(fireStep, stepMs);
}

export function playComicSfx(kind: ComicSfxKind) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  if (kind === "crown") {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const t = now + idx * 0.065;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.14, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.36);
      osc.connect(g).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
    return;
  }

  if (kind === "purr") {
    const carrier = ac.createOscillator();
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    const lp = ac.createBiquadFilter();
    const out = ac.createGain();

    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(66, now);
    carrier.frequency.linearRampToValueAtTime(58, now + 0.55);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(26, now);
    lfoGain.gain.setValueAtTime(0.075, now);

    lp.type = "lowpass";
    lp.frequency.setValueAtTime(260, now);

    out.gain.setValueAtTime(0.001, now);
    out.gain.linearRampToValueAtTime(0.16, now + 0.08);
    out.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    lfo.connect(lfoGain).connect(out.gain);
    carrier.connect(lp).connect(out).connect(ac.destination);
    carrier.start(now);
    lfo.start(now);
    carrier.stop(now + 0.65);
    lfo.stop(now + 0.65);
    return;
  }

  if (kind === "valve") {
    // Metallic ratchet clanks
    [0, 0.07, 0.14].forEach((offset, i) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const t = now + offset;
      osc.type = "square";
      osc.frequency.setValueAtTime(340 + i * 110, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.045);
      g.gain.setValueAtTime(0.09, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(g).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    });
    // Radiator steam hiss
    const src = ac.createBufferSource();
    src.buffer = getNoiseBuffer(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(2800, now + 0.12);
    bp.Q.setValueAtTime(1.4, now + 0.12);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.001, now + 0.12);
    g.gain.linearRampToValueAtTime(0.14, now + 0.18);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.62);
    src.connect(bp).connect(g).connect(ac.destination);
    src.start(now + 0.12);
    src.stop(now + 0.65);
    return;
  }

  if (kind === "crash") {
    // Ceramic shatter noise burst + cartoon descending whistle
    const src = ac.createBufferSource();
    src.buffer = getNoiseBuffer(ac);
    const hp = ac.createBiquadFilter();
    hp.type = "bandpass";
    hp.frequency.setValueAtTime(2200, now);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    src.connect(hp).connect(g).connect(ac.destination);
    src.start(now);
    src.stop(now + 0.36);

    const osc = ac.createOscillator();
    const og = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(920, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.32);
    og.gain.setValueAtTime(0.12, now + 0.04);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.33);
    osc.connect(og).connect(ac.destination);
    osc.start(now + 0.04);
    osc.stop(now + 0.35);
    return;
  }

  if (kind === "sunbeam") {
    // Radiant warm major-9th chord pad swell
    [261.63, 329.63, 392.0, 493.88, 587.33].forEach((f, idx) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.065, now + 0.14);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.92);
      osc.connect(g).connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.96);
    });
    return;
  }

  if (kind === "beat") {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.18);
    g.gain.setValueAtTime(0.22, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(g).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.22);
    return;
  }

  if (kind === "ascend") {
    [392.0, 493.88, 587.33, 783.99, 987.77].forEach((f, idx) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      const t = now + idx * 0.075;
      osc.type = idx < 2 ? "sawtooth" : "triangle";
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(2200, t);
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.11, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(lp).connect(g).connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    });
    return;
  }

  if (kind === "pop") {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(290, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.075);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(g).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.1);
    return;
  }

  // whoosh
  const src = ac.createBufferSource();
  src.buffer = getNoiseBuffer(ac);
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(340, now);
  bp.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
  bp.Q.setValueAtTime(1.8, now);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.08, now + 0.06);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  src.connect(bp).connect(g).connect(ac.destination);
  src.start(now);
  src.stop(now + 0.24);
}

export function disposeRamsesAudio() {
  toggleDiscoLoop(false);
  if (ctx) {
    ctx.close().catch(() => {});
    ctx = null;
  }
}
