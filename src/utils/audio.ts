// Procedural Web Audio API sound synthesis and SpeechSynthesis for children's educational game

let audioCtx: AudioContext | null = null;
let bgmOscInterval: number | null = null;
let isBgmPlaying = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessChime(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.08);
    osc.stop(ctx.currentTime + index * 0.08 + 0.4);
  });
}

export function playErrorBoing(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

export function playPop(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

export function playClick(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

export function playLevelUpFanfare(soundEnabled = true): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 440, delay: 0, dur: 0.12 },     // A4
    { freq: 554.37, delay: 0.12, dur: 0.12 }, // C#5
    { freq: 659.25, delay: 0.24, dur: 0.12 }, // E5
    { freq: 880, delay: 0.36, dur: 0.35 },    // A5
    { freq: 1108.73, delay: 0.55, dur: 0.45 } // C#6
  ];

  notes.forEach(({ freq, delay, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.01, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + dur + 0.05);
  });
}

// Gentle procedurally generated pentatonic music for kids
const BGM_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
let bgmStep = 0;

export function toggleBgm(play: boolean): void {
  if (!play) {
    if (bgmOscInterval) {
      window.clearInterval(bgmOscInterval);
      bgmOscInterval = null;
    }
    isBgmPlaying = false;
    return;
  }

  if (isBgmPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isBgmPlaying = true;
  bgmStep = 0;

  // Gentle note every 450ms
  bgmOscInterval = window.setInterval(() => {
    if (!isBgmPlaying || !ctx) return;
    try {
      const freq = BGM_SCALE[bgmStep % BGM_SCALE.length];
      bgmStep = (bgmStep + (Math.random() > 0.4 ? 1 : 2)) % BGM_SCALE.length;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext catch
    }
  }, 480);
}

// Clear English speech synthesis
export function speakWord(text: string, rate = 0.9): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // Gentle slightly slower pace for kids
    utterance.pitch = 1.15; // Friendly warm pitch
    utterance.lang = 'en-US';

    // Try finding a friendly English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Graceful fallback
  }
}
