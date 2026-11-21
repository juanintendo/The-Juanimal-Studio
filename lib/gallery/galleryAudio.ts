// Procedural Web Audio API foley for the Juanimal Designs gallery & 4-world Dragon About

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined" || isMuted) return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setGalleryMuted(next: boolean) {
  isMuted = next;
}

export function playPaperHover() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(340, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.055);
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

export function playPaperClick() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.08);
  const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1400;
  filter.Q.value = 1.1;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.09, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  src.start(now);

  const tone = ctx.createOscillator();
  const tg = ctx.createGain();
  tone.type = "sine";
  tone.frequency.setValueAtTime(523.25, now);
  tone.frequency.exponentialRampToValueAtTime(783.99, now + 0.14);
  tg.gain.setValueAtTime(0.06, now);
  tg.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  tone.connect(tg);
  tg.connect(ctx.destination);
  tone.start(now);
  tone.stop(now + 0.17);
}

export function playPortalMorph(worldIdx: number) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const chords = [
    [523.25, 659.25, 783.99], // Day: C major warm chime
    [440.0, 523.25, 659.25],  // Night: Am dreamy twilight
    [392.0, 466.16, 587.33],  // Rain: Gm moody indigo
    [587.33, 739.99, 880.0],  // Rainbow: D major sparkly
  ];
  const notes = chords[worldIdx % chords.length];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = i === 0 ? "triangle" : "sine";
    const t0 = now + i * 0.045;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.001, t0);
    g.gain.linearRampToValueAtTime(0.055, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.42);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.44);
  });
}

export function playSparkleChime() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(987.77, now);
  osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.14);
  g.gain.setValueAtTime(0.04, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

export function disposeGalleryAudio() {
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}
