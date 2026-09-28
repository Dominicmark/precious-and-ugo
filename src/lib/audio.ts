/**
 * Wedding Audio Engine
 * Supports custom audio soundtracks (MP3/M4A/WAV), URL streams, and Web Audio API synthesizer.
 */

export const DEFAULT_WEDDING_SONG_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790592237/The_Greatest_Showman_Cast_-_Rewrite_The_Stars_Official_Audio_dbub9s.mp3';
export const DEFAULT_LOCAL_AUDIO = '/audio/wedding-song.mp3';
export const WEDDING_SONG_TITLE = 'Rewrite The Stars - The Greatest Showman Cast';

const STORAGE_MUSIC_URL_KEY = 'ugoamaka26_bg_music_url';

let audioCtx: AudioContext | null = null;
let bgMusicGain: GainNode | null = null;
let bgMusicOscs: OscillatorNode[] = [];
let isPlayingBgMusic = false;

// HTML5 Audio element for custom song playback
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
 * Returns current custom music URL if set, default to Rewrite The Stars
 */
export function getCustomMusicUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_WEDDING_SONG_URL;
  const stored = localStorage.getItem(STORAGE_MUSIC_URL_KEY);
  if (stored && stored.trim()) {
    return stored.trim();
  }
  return DEFAULT_WEDDING_SONG_URL;
}

/**
 * Sets and saves custom music URL, switching playback if currently active
 */
export function setCustomMusicUrl(url: string) {
  if (typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (trimmed && trimmed !== DEFAULT_WEDDING_SONG_URL) {
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

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a realistic soft paper envelope slide & unfold sound
 */
export function playEnvelopeOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);
  filter.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.4);
}

/**
 * Plays a celebratory warm harp/celesta chime upon scratch reveal
 */
export function playCelebrationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [440, 554.37, 659.25, 830.61, 987.77, 1318.51];

  notes.forEach((freq, index) => {
    const noteTime = now + index * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    const oscHarmonic = ctx.createOscillator();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    oscHarmonic.start(noteTime);
    osc.stop(noteTime + 1.3);
    oscHarmonic.stop(noteTime + 1.3);
  });
}

/**
 * Plays a gentle scratch friction sound during card scratch
 */
export function playScratchSwoosh() {
  const ctx = getAudioContext();
  if (!ctx) return;

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
}

/**
 * Plays a crisp tactile wax seal break/snap sound
 */
export function playWaxBreakSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

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
  masterGain.gain.linearRampToValueAtTime(0.04, now + 2);
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
 * Toggles background wedding song loop with graceful fade-in / fade-out
 */
export function toggleBackgroundMusic(enabled?: boolean): boolean {
  const targetState = enabled !== undefined ? enabled : !isPlayingBgMusic;

  // STOP MUSIC
  if (!targetState) {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    // Fade out custom audio element if present
    if (customAudioEl && !customAudioEl.paused) {
      const step = 0.05;
      fadeInterval = window.setInterval(() => {
        if (!customAudioEl) return;
        if (customAudioEl.volume > step) {
          customAudioEl.volume -= step;
        } else {
          customAudioEl.pause();
          customAudioEl.volume = 0.6;
          if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
          }
        }
      }, 50);
    }

    // Fade out synth if present
    const ctx = audioCtx;
    if (ctx && bgMusicGain) {
      bgMusicGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        bgMusicOscs.forEach((o) => {
          try {
            o.stop();
          } catch {
            /* ignore */
          }
        });
        bgMusicOscs = [];
      }, 500);
    }

    notifyMusicState(false);
    return false;
  }

  // START MUSIC
  const musicUrl = getCustomMusicUrl();

  // Try custom audio element first
  if (musicUrl) {
    if (!customAudioEl) {
      customAudioEl = new Audio();
      customAudioEl.loop = true;
      customAudioEl.preload = 'auto';
    }

    if (customAudioEl.src !== musicUrl) {
      customAudioEl.src = musicUrl;
    }

    customAudioEl.volume = 0.05;
    const playPromise = customAudioEl.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Smooth fade-in
          if (fadeInterval) clearInterval(fadeInterval);
          fadeInterval = window.setInterval(() => {
            if (!customAudioEl) return;
            if (customAudioEl.volume < 0.65) {
              customAudioEl.volume = Math.min(0.65, customAudioEl.volume + 0.05);
            } else {
              if (fadeInterval) {
                clearInterval(fadeInterval);
                fadeInterval = null;
              }
            }
          }, 80);

          notifyMusicState(true);
        })
        .catch(() => {
          // If remote link fails, attempt local audio file
          if (customAudioEl && customAudioEl.src !== DEFAULT_LOCAL_AUDIO && !customAudioEl.src.endsWith(DEFAULT_LOCAL_AUDIO)) {
            customAudioEl.src = DEFAULT_LOCAL_AUDIO;
            customAudioEl.play()
              .then(() => {
                notifyMusicState(true);
              })
              .catch(() => {
                // If local audio also fails, fallback to luxury synth chords
                const ctx = getAudioContext();
                if (ctx) {
                  playSynthesizedAmbientHarmony(ctx);
                  notifyMusicState(true);
                } else {
                  notifyMusicState(false);
                }
              });
          } else {
            const ctx = getAudioContext();
            if (ctx) {
              playSynthesizedAmbientHarmony(ctx);
              notifyMusicState(true);
            } else {
              notifyMusicState(false);
            }
          }
        });

      return true;
    }
  }

  // Fallback: Web Audio synthesizer
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    playSynthesizedAmbientHarmony(ctx);
    notifyMusicState(true);
    return true;
  } catch {
    notifyMusicState(false);
    return false;
  }
}

export function isBgMusicPlaying(): boolean {
  return isPlayingBgMusic;
}
