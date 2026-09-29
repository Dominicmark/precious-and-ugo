/**
 * Wedding Audio Engine
 * High-fidelity soundtrack manager: "Rewrite The Stars"
 * Supports local audio, Cloudinary stream, and Web Audio API synthesizer.
 */

export const DEFAULT_LOCAL_AUDIO = '/audio/wedding-song.mp3';
export const DEFAULT_WEDDING_SONG_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790592237/The_Greatest_Showman_Cast_-_Rewrite_The_Stars_Official_Audio_dbub9s.mp3';
export const WEDDING_SONG_TITLE = 'Rewrite The Stars - The Greatest Showman Cast';

const STORAGE_MUSIC_URL_KEY = 'ugoamaka26_bg_music_url';

let audioCtx: AudioContext | null = null;
let bgMusicGain: GainNode | null = null;
let bgMusicOscs: OscillatorNode[] = [];
let isPlayingBgMusic = false;

// Shared HTML5 Audio element for custom song playback
let customAudioEl: HTMLAudioElement | null = null;
let fadeInterval: number | null = null;

function notifyMusicState(playing: boolean) {
  isPlayingBgMusic = playing;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('wedding-music-state-change', { detail: { isPlaying: playing } })
    );
  }
}

/**
 * Returns current custom music URL if set, default to local/CDN song
 */
export function getCustomMusicUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCAL_AUDIO;
  const stored = localStorage.getItem(STORAGE_MUSIC_URL_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  return DEFAULT_LOCAL_AUDIO;
}

/**
 * Sets and saves custom music URL, switching playback if currently active
 */
export function setCustomMusicUrl(url: string) {
  if (typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (trimmed && trimmed !== DEFAULT_LOCAL_AUDIO && trimmed !== DEFAULT_WEDDING_SONG_URL) {
    localStorage.setItem(STORAGE_MUSIC_URL_KEY, trimmed);
  } else {
    localStorage.removeItem(STORAGE_MUSIC_URL_KEY);
  }

  // If currently playing, restart with new URL
  if (isPlayingBgMusic) {
    toggleBackgroundMusic(false);
    setTimeout(() => {
      toggleBackgroundMusic(true);
    }, 200);
  }
}

export function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Primes and unlocks audio context and media element during any user gesture
 */
export function primeAudio() {
  getAudioContext();
  if (!customAudioEl && typeof window !== 'undefined') {
    getOrCreateAudioElement();
  }
}

function getOrCreateAudioElement(): HTMLAudioElement {
  if (!customAudioEl && typeof window !== 'undefined') {
    customAudioEl = new Audio();
    customAudioEl.loop = true;
    customAudioEl.preload = 'auto';
    customAudioEl.volume = 0.8;
  }
  return customAudioEl!;
}

/**
 * Plays a realistic soft paper envelope slide & unfold sound
 */
export function playEnvelopeOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.4);
  } catch {
    /* ignore audio errors */
  }
}

/**
 * Plays celebratory chime chords
 */
export function playCelebrationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const noteTime = now + i * 0.08;
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, noteTime);

      gain.gain.setValueAtTime(0.06, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      oscHarmonic.start(noteTime);
      osc.stop(noteTime + 1.3);
      oscHarmonic.stop(noteTime + 1.3);
    });
  } catch {
    /* ignore */
  }
}

/**
 * Plays a gentle scratch friction sound during card scratch
 */
export function playScratchSwoosh() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    /* ignore */
  }
}

/**
 * Plays a crisp tactile wax seal break/snap sound
 */
export function playWaxBreakSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    /* ignore */
  }
}

/**
 * Helper to play synthesized fallback chords
 */
function playSynthesizedAmbientHarmony(ctx: AudioContext) {
  bgMusicOscs.forEach((o) => {
    try {
      o.stop();
    } catch {
      /* ignore */
    }
  });
  bgMusicOscs = [];

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.08, now + 1);
  masterGain.connect(ctx.destination);
  bgMusicGain = masterGain;

  const chord = [220, 277.18, 329.63, 440];
  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.value = (Math.random() - 0.5) * 0.6;
      osc.connect(panner);
      panner.connect(masterGain);
    } else {
      osc.connect(masterGain);
    }

    osc.start(now);
    bgMusicOscs.push(osc);
  });
}

/**
 * Toggles background wedding song loop with crystal-clear audible volume
 */
export function toggleBackgroundMusic(enabled?: boolean): boolean {
  const targetState = enabled !== undefined ? enabled : !isPlayingBgMusic;

  // STOP / MUTE MUSIC
  if (!targetState) {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    if (customAudioEl) {
      try {
        customAudioEl.pause();
      } catch {
        /* ignore */
      }
    }

    const ctx = audioCtx;
    if (ctx && bgMusicGain) {
      try {
        bgMusicGain.gain.setValueAtTime(0.00001, ctx.currentTime);
      } catch {
        /* ignore */
      }
      bgMusicOscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* ignore */
        }
      });
      bgMusicOscs = [];
    }

    notifyMusicState(false);
    return false;
  }

  // START / UNMUTE MUSIC
  getAudioContext();
  const audio = getOrCreateAudioElement();
  const primaryUrl = getCustomMusicUrl();

  const tryPlay = (url: string, isFallback = false) => {
    if (!audio.src || !audio.src.includes(url)) {
      audio.src = url;
    }
    audio.volume = 0.8; // Direct audible volume (no near-silence 0.05)

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          notifyMusicState(true);
        })
        .catch(() => {
          if (!isFallback) {
            // Try alternative source (Cloudinary if local, or local if Cloudinary)
            const fallbackUrl = url === DEFAULT_LOCAL_AUDIO ? DEFAULT_WEDDING_SONG_URL : DEFAULT_LOCAL_AUDIO;
            tryPlay(fallbackUrl, true);
          } else {
            // If both audio file attempts fail, fallback to Web Audio synthesizer
            const ctx = getAudioContext();
            if (ctx) {
              playSynthesizedAmbientHarmony(ctx);
              notifyMusicState(true);
            } else {
              notifyMusicState(false);
            }
          }
        });
    }
  };

  tryPlay(primaryUrl);
  return true;
}

export function isBgMusicPlaying(): boolean {
  return isPlayingBgMusic;
}
