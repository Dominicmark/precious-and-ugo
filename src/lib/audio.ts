/**
 * Wedding Audio Engine
 * High-fidelity soundtrack manager: "Rewrite The Stars"
 * Supports local audio, Cloudinary stream, tactile sounds, and sparkle chimes.
 */

export const DEFAULT_LOCAL_AUDIO = '/audio/wedding-song.mp3';
export const DEFAULT_WEDDING_SONG_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790592237/The_Greatest_Showman_Cast_-_Rewrite_The_Stars_Official_Audio_dbub9s.mp3';
export const WEDDING_SONG_TITLE = 'Rewrite The Stars - The Greatest Showman Cast';

const STORAGE_MUSIC_URL_KEY = 'ugoamaka26_bg_music_url';

let audioCtx: AudioContext | null = null;
let customAudioEl: HTMLAudioElement | null = null;
let isPlayingBgMusic = false;

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

function getOrCreateAudioElement(): HTMLAudioElement {
  if (!customAudioEl && typeof window !== 'undefined') {
    customAudioEl = new Audio();
    customAudioEl.loop = true;
    customAudioEl.preload = 'auto';
    customAudioEl.volume = 0.85;

    const initialUrl = getCustomMusicUrl();
    customAudioEl.src = initialUrl;

    customAudioEl.addEventListener('play', () => {
      notifyMusicState(true);
    });

    customAudioEl.addEventListener('pause', () => {
      notifyMusicState(false);
    });

    customAudioEl.addEventListener('ended', () => {
      notifyMusicState(false);
    });

    customAudioEl.addEventListener('error', () => {
      // If primary failed, try remote fallback
      if (customAudioEl && !customAudioEl.src.includes('cloudinary')) {
        customAudioEl.src = DEFAULT_WEDDING_SONG_URL;
        customAudioEl.load();
        if (isPlayingBgMusic) {
          customAudioEl.play().catch(() => notifyMusicState(false));
        }
      } else {
        notifyMusicState(false);
      }
    });
  }
  return customAudioEl!;
}

/**
 * Primes and unlocks audio context and media element during any user gesture
 */
export function primeAudio() {
  getAudioContext();
  if (typeof window !== 'undefined') {
    const audio = getOrCreateAudioElement();
    if (!audio.src) {
      audio.src = getCustomMusicUrl();
    }
  }
}

/**
 * Plays a clean, crisp tactile click sound when the envelope is touched
 */
export function playTactileClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Snappy high-frequency click transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.018);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.022);

    // Subtle low body punch
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(350, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(90, now + 0.025);

    bodyGain.gain.setValueAtTime(0.18, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.028);
  } catch {
    /* ignore */
  }
}

/**
 * Plays a magical, shimmering crystalline glitter / sparkle sound as the envelope opens
 */
export function playGlitterSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Twinkling celestial micro-chime frequencies: F#5, A5, C#6, E6, G#6, B6, E7, G#7
    const sparkleNotes = [1479.98, 1760.00, 2217.46, 2637.02, 3322.44, 3951.07, 4978.03, 6271.93];

    sparkleNotes.forEach((freq, idx) => {
      // Randomized twinkling cascade delay over ~0.9s
      const delay = idx * 0.08 + (Math.random() * 0.04 - 0.02);
      const startTime = now + Math.max(0, delay);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      // Subtle sparkle pitch glissando
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.25);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch {
    /* ignore */
  }
}

/**
 * Plays a realistic soft paper envelope slide & unfold sound
 */
export function playEnvelopeOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch {
    /* ignore audio errors */
  }
}

/**
 * Plays a gentle scratch friction sound during card scratch
 */
export function playScratchSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 + Math.random() * 400, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.05);
  } catch {
    /* ignore */
  }
}

/**
 * Plays a subtle swoosh scratch sound during scratch reveal gestures
 */
export function playScratchSwoosh() {
  playScratchSound();
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
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    /* ignore */
  }
}

/**
 * Plays a crystalline celebratory chime arpeggio on card reveal / RSVP success
 */
export function playCelebrationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const freqs = [659.25, 830.61, 987.77, 1318.51];

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  } catch {
    /* ignore */
  }
}

/**
 * Toggles background wedding song loop with crystal-clear audible volume
 */
export function toggleBackgroundMusic(enabled?: boolean): boolean {
  if (typeof window === 'undefined') return false;

  getAudioContext();
  const audio = getOrCreateAudioElement();
  const currentlyPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
  const targetState = enabled !== undefined ? enabled : !currentlyPlaying;

  if (!targetState) {
    try {
      audio.pause();
    } catch {
      /* ignore */
    }
    notifyMusicState(false);
    return false;
  }

  // START / UNMUTE MUSIC
  if (!audio.src) {
    audio.src = getCustomMusicUrl();
  }
  audio.volume = 0.85;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        notifyMusicState(true);
      })
      .catch((err) => {
        console.warn('Playback initiation deferred until user interaction:', err);
        // If local path failed, try the Cloudinary link
        if (!audio.src.includes('cloudinary')) {
          audio.src = DEFAULT_WEDDING_SONG_URL;
          audio.load();
          audio.play()
            .then(() => notifyMusicState(true))
            .catch(() => notifyMusicState(false));
        } else {
          notifyMusicState(false);
        }
      });
  }

  return true;
}

export function isBgMusicPlaying(): boolean {
  if (!customAudioEl) return false;
  return !customAudioEl.paused && !customAudioEl.ended && customAudioEl.readyState >= 1;
}
