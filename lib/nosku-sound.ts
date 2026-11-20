"use client";

/**
 * Procedural Web Audio foley engine for NO SKU™.
 * Synthesizes tactile tape tears, presses, orbital sweeps, paper rustles,
 * and velocity-scaled ball impacts with zero external audio asset dependencies.
 */

export type SoundCue =
  | "TAPE_CUT"
  | "TAPE_PRESS"
  | "SLIDE_CHANGE"
  | "BALL_HIT"
  | "MENU_PULL"
  | "MENU_HOVER"
  | "SOUND_TOGGLE";

type SoundSubscriber = (enabled: boolean) => void;

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;
let enabled = false;

const subscribers = new Set<SoundSubscriber>();

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function getContext(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.82;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    if (!masterGain) return null;
    return { ctx, master: masterGain };
  } catch {
    return null;
  }
}

function getNoiseBuffer(audioCtx: AudioContext): AudioBuffer | null {
  try {
    if (
      cachedNoiseBuffer &&
      cachedNoiseBuffer.sampleRate === audioCtx.sampleRate
    ) {
      return cachedNoiseBuffer;
    }
    const length = Math.max(1, Math.floor(audioCtx.sampleRate * 2));
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    // Warm lightly shaped white-pink noise blend for natural tape & paper texture
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      const pink = (b0 + b1 + b2 + white * 0.18) * 0.55;
      data[i] = clamp(white * 0.52 + pink * 0.48, -1, 1);
    }
    cachedNoiseBuffer = buffer;
    return buffer;
  } catch {
    return null;
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function subscribeSound(cb: SoundSubscriber): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function setSoundEnabled(on: boolean): void {
  const next = Boolean(on);
  enabled = next;
  if (next) {
    getContext();
  }
  subscribers.forEach((cb) => {
    try {
      cb(next);
    } catch {
      // Ignore subscriber errors
    }
  });
  if (next) {
    playOnce("SOUND_TOGGLE", 1);
  }
}

export function playOnce(cue: SoundCue, intensity = 1): void {
  if (!enabled) return;
  const audio = getContext();
  if (!audio) return;

  const { ctx: ac, master } = audio;
  const amp = clamp(intensity, 0.05, 1.25);
  const now = ac.currentTime;

  try {
    switch (cue) {
      case "TAPE_CUT": {
        const noise = getNoiseBuffer(ac);
        if (noise) {
          const src = ac.createBufferSource();
          src.buffer = noise;
          const hp = ac.createBiquadFilter();
          hp.type = "highpass";
          hp.Q.value = 1.6;
          hp.frequency.setValueAtTime(2400, now);
          hp.frequency.exponentialRampToValueAtTime(5200, now + 0.06);

          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.32 * amp, now + 0.006);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

          src.connect(hp);
          hp.connect(gain);
          gain.connect(master);
          src.start(now);
          src.stop(now + 0.07);
        }

        // Punchy low snap
        const osc = ac.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.065);
        const snapGain = ac.createGain();
        snapGain.gain.setValueAtTime(0.28 * amp, now);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
        osc.connect(snapGain);
        snapGain.connect(master);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case "TAPE_PRESS": {
        const noise = getNoiseBuffer(ac);
        if (noise) {
          const src = ac.createBufferSource();
          src.buffer = noise;
          const bp = ac.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(700, now);
          bp.Q.value = 1.4;

          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2 * amp, now + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

          src.connect(bp);
          bp.connect(gain);
          gain.connect(master);
          src.start(now);
          src.stop(now + 0.055);
        }

        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.05);
        const thump = ac.createGain();
        thump.gain.setValueAtTime(0.22 * amp, now);
        thump.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
        osc.connect(thump);
        thump.connect(master);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case "SLIDE_CHANGE": {
        const noise = getNoiseBuffer(ac);
        if (noise) {
          const src = ac.createBufferSource();
          src.buffer = noise;
          const bp = ac.createBiquadFilter();
          bp.type = "bandpass";
          bp.Q.value = 1.8;
          bp.frequency.setValueAtTime(320, now);
          bp.frequency.exponentialRampToValueAtTime(1800, now + 0.22);

          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.16 * amp, now + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);

          src.connect(bp);
          bp.connect(gain);
          gain.connect(master);
          src.start(now);
          src.stop(now + 0.24);
        }

        // Crisp mechanical detent click
        const click = ac.createOscillator();
        click.type = "triangle";
        click.frequency.setValueAtTime(1120, now);
        click.frequency.exponentialRampToValueAtTime(420, now + 0.012);
        const clickGain = ac.createGain();
        clickGain.gain.setValueAtTime(0.12 * amp, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
        click.connect(clickGain);
        clickGain.connect(master);
        click.start(now);
        click.stop(now + 0.018);
        break;
      }

      case "BALL_HIT": {
        const norm = clamp(intensity, 0.05, 1);
        const freq = 170 + norm * 165;
        const hitGainVal = clamp(0.08 + norm * 0.28, 0, 0.36);

        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(58, freq * 0.42), now + 0.085);

        const body = ac.createOscillator();
        body.type = "triangle";
        body.frequency.setValueAtTime(freq * 1.45, now);
        body.frequency.exponentialRampToValueAtTime(freq * 0.65, now + 0.055);

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(hitGainVal, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

        const bodyGain = ac.createGain();
        bodyGain.gain.setValueAtTime(hitGainVal * 0.35, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(gain);
        body.connect(bodyGain);
        gain.connect(master);
        bodyGain.connect(master);

        osc.start(now);
        body.start(now);
        osc.stop(now + 0.1);
        body.stop(now + 0.065);
        break;
      }

      case "MENU_PULL": {
        const noise = getNoiseBuffer(ac);
        if (noise) {
          const src = ac.createBufferSource();
          src.buffer = noise;
          const lp = ac.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.setValueAtTime(1100, now);
          lp.frequency.linearRampToValueAtTime(480, now + 0.18);

          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.11 * amp, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.185);

          src.connect(lp);
          lp.connect(gain);
          gain.connect(master);
          src.start(now);
          src.stop(now + 0.19);
        }

        // Soft two-note descending chime
        const n1 = ac.createOscillator();
        const n2 = ac.createOscillator();
        n1.type = "sine";
        n2.type = "sine";
        n1.frequency.setValueAtTime(587.33, now + 0.02);
        n2.frequency.setValueAtTime(440, now + 0.09);

        const g1 = ac.createGain();
        g1.gain.setValueAtTime(0.0001, now);
        g1.gain.linearRampToValueAtTime(0.08 * amp, now + 0.03);
        g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.0001, now);
        g2.gain.linearRampToValueAtTime(0.075 * amp, now + 0.095);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);

        n1.connect(g1);
        n2.connect(g2);
        g1.connect(master);
        g2.connect(master);
        n1.start(now + 0.02);
        n2.start(now + 0.09);
        n1.stop(now + 0.15);
        n2.stop(now + 0.22);
        break;
      }

      case "MENU_HOVER": {
        const osc = ac.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.015);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.045 * amp, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.017);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }

      case "SOUND_TOGGLE": {
        const b1 = ac.createOscillator();
        const b2 = ac.createOscillator();
        b1.type = "sine";
        b2.type = "sine";
        b1.frequency.setValueAtTime(520, now);
        b2.frequency.setValueAtTime(780, now + 0.055);

        const g1 = ac.createGain();
        g1.gain.setValueAtTime(0.001, now);
        g1.gain.linearRampToValueAtTime(0.11, now + 0.008);
        g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.0001, now);
        g2.gain.linearRampToValueAtTime(0.12, now + 0.062);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.145);

        b1.connect(g1);
        b2.connect(g2);
        g1.connect(master);
        g2.connect(master);
        b1.start(now);
        b2.start(now + 0.055);
        b1.stop(now + 0.075);
        b2.stop(now + 0.155);
        break;
      }
    }
  } catch {
    // Ignore restricted/headless audio errors
  }
}

export interface StretchLoopHandle {
  set: (volume: number, rate?: number) => void;
  stop: () => void;
}

export function createStretchLoop(): StretchLoopHandle {
  let src: AudioBufferSourceNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let gain: GainNode | null = null;
  let started = false;
  let stopped = false;

  const ensureNodes = () => {
    if (stopped || started) return;
    const audio = getContext();
    if (!audio) return;
    const noise = getNoiseBuffer(audio.ctx);
    if (!noise) return;
    try {
      src = audio.ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;

      filter = audio.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 2.1;

      gain = audio.ctx.createGain();
      gain.gain.value = 0;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(audio.master);
      src.start();
      started = true;
    } catch {
      started = false;
    }
  };

  return {
    set(volume: number, rate = 1) {
      if (stopped) return;
      if (!enabled || volume <= 0.002) {
        if (gain && ctx) {
          try {
            gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
          } catch {
            // noop
          }
        }
        return;
      }
      ensureNodes();
      if (!gain || !filter || !ctx) return;
      try {
        const targetGain = clamp(volume, 0, 1) * 0.28;
        const targetFreq = clamp(900 * rate, 350, 3400);
        gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);
        filter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
      } catch {
        // noop
      }
    },
    stop() {
      if (stopped) return;
      stopped = true;
      try {
        if (gain && ctx) {
          gain.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
        }
        src?.stop();
        src?.disconnect();
        filter?.disconnect();
        gain?.disconnect();
      } catch {
        // noop
      }
      src = null;
      filter = null;
      gain = null;
    },
  };
}
