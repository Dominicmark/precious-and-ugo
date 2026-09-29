import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  playTactileClickSound,
  playGlitterSparkleSound,
  toggleBackgroundMusic,
  primeAudio,
} from '../lib/audio';
import { AudioPlayerToggle } from './AudioPlayerToggle';

interface EnvelopeProps {
  onOpenComplete: () => void;
}

const LOOPING_VIDEO_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790561471/Wedding_invitation_envelope_disp__1080p_20260928022401_hwjrhy.mp4';
const LOOPING_POSTER_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/f_auto,q_auto:good,w_1200/v1790561471/Wedding_invitation_envelope_disp__1080p_20260928022401_hwjrhy.jpg';

const OPENING_VIDEO_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790562046/Envelope_vanishes_in_golden_flash_20260928030448_re8cbd.mp4';
const OPENING_POSTER_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/f_auto,q_auto:good,w_1200/v1790562046/Envelope_vanishes_in_golden_flash_20260928030448_re8cbd.jpg';

export const Envelope: React.FC<EnvelopeProps> = ({ onOpenComplete }) => {
  const [stage, setStage] = useState<'idle' | 'opening' | 'flashing'>('idle');
  const [isOpeningVideoReady, setIsOpeningVideoReady] = useState(false);

  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const openingVideoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredCompleteRef = useRef(false);

  // Pre-buffer the opening video when the envelope mounts
  useEffect(() => {
    if (openingVideoRef.current) {
      openingVideoRef.current.load();
    }
  }, []);

  const finishOpening = () => {
    if (hasTriggeredCompleteRef.current) return;
    hasTriggeredCompleteRef.current = true;
    if (openingVideoRef.current) {
      openingVideoRef.current.pause();
    }
    if (loopVideoRef.current) {
      loopVideoRef.current.pause();
    }
    onOpenComplete();
  };

  const handleTapAnywhere = () => {
    if (stage !== 'idle') return;
    setStage('opening');

    // 1. Prime audio and play crisp tactile click sound instantly when touched
    primeAudio();
    playTactileClickSound();

    // 2. Play the opening envelope video with its AUDIO TURNED ON (unmuted)
    if (openingVideoRef.current) {
      openingVideoRef.current.currentTime = 0;
      openingVideoRef.current.muted = false;
      openingVideoRef.current.volume = 1.0;
      const playPromise = openingVideoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsOpeningVideoReady(true);
          })
          .catch(() => {
            // Fallback: If browser audio policy restricts unmuted play, retry with muted
            if (openingVideoRef.current) {
              openingVideoRef.current.muted = true;
              openingVideoRef.current.play().catch(() => {});
            }
            setIsOpeningVideoReady(true);
          });
      }
    }

    // 3. Play magical glitter / sparkling sound as envelope begins opening
    setTimeout(() => {
      playGlitterSparkleSound();
    }, 150);

    // 4. Then start background wedding music right after sparkling chimes
    setTimeout(() => {
      toggleBackgroundMusic(true);
    }, 1100);

    // Allow the envelope opening animation & letter reveal to play naturally
    // Golden illumination blooms at 3.8s, smoothly transitioning to the invitation card
    setTimeout(() => {
      setStage('flashing');
    }, 3800);

    setTimeout(() => {
      finishOpening();
    }, 4300);
  };

  // When opening video reaches its first rendered frame, pause the background loop video seamlessly
  const handleOpeningTimeUpdate = () => {
    if (!openingVideoRef.current) return;
    const curTime = openingVideoRef.current.currentTime;

    if (curTime > 0.08 && !isOpeningVideoReady) {
      setIsOpeningVideoReady(true);
      if (loopVideoRef.current) {
        loopVideoRef.current.pause();
      }
    }

    // Trigger golden flash right as the letter dissolves into light (~3.8s)
    if (curTime >= 3.8 && stage === 'opening') {
      setStage('flashing');
    }

    // Transition to the invitation when the video finishes or reaches 4.4s
    if (curTime >= 4.4) {
      finishOpening();
    }
  };

  return (
    <div
      onClick={handleTapAnywhere}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTapAnywhere();
        }
      }}
      className="fixed inset-0 w-full h-full cursor-pointer select-none overflow-hidden bg-black z-40"
      aria-label="Tap anywhere on the screen to open the wedding invitation"
    >
      {/* Speaker Icon in Top Left */}
      <div
        className="fixed top-3 left-3 sm:left-6 z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <AudioPlayerToggle />
      </div>

      {/* 1. Looping Envelope Video: Remains visible until Video 2 is actively rendering */}
      <video
        ref={loopVideoRef}
        src={LOOPING_VIDEO_URL}
        poster={LOOPING_POSTER_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isOpeningVideoReady ? 'opacity-0 z-0' : 'opacity-100 z-10'
        }`}
      />

      {/* 2. Opening Envelope Video: Audio turned ON on touch/tap */}
      <video
        ref={openingVideoRef}
        src={OPENING_VIDEO_URL}
        poster={OPENING_POSTER_URL}
        playsInline
        preload="auto"
        onTimeUpdate={handleOpeningTimeUpdate}
        onEnded={finishOpening}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isOpeningVideoReady ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Elegant Floating Prompt: Just the words, no symbol, thick navy blue & thicker font */}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="absolute bottom-10 sm:bottom-14 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4"
          >
            <motion.p
              animate={{ opacity: [0.85, 1, 0.85], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              className="font-serif-luxury text-base sm:text-lg md:text-xl tracking-[0.3em] font-black text-[#0E1B2E] uppercase select-none text-center"
              style={{
                WebkitTextStroke: '0.65px #0E1B2E',
                paintOrder: 'stroke fill',
                textShadow:
                  '0 0 14px rgba(255,255,255,0.9), 0 0 24px rgba(236,200,128,0.7), 0 1px 3px rgba(255,255,255,0.95)',
              }}
            >
              Tap to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warm Golden / Champagne Flash Transition directly as letter unfolds into hero */}
      <AnimatePresence>
        {stage === 'flashing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#FAF5EA] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
