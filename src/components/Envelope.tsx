import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playEnvelopeOpenSound, playWaxBreakSound, toggleBackgroundMusic, primeAudio } from '../lib/audio';

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
    onOpenComplete();
  };

  const handleTapAnywhere = () => {
    if (stage !== 'idle') return;
    setStage('opening');

    // Unlock and start background music synchronously within direct user gesture
    primeAudio();
    toggleBackgroundMusic(true);

    // Trigger authentic tactile sound effects
    playWaxBreakSound();
    setTimeout(() => {
      playEnvelopeOpenSound();
    }, 120);

    // Play the opening envelope video
    if (openingVideoRef.current) {
      openingVideoRef.current.currentTime = 0;
      openingVideoRef.current.muted = true; // Ensure mobile browsers allow instant play without block
      const playPromise = openingVideoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Once playback confirmed started
            setIsOpeningVideoReady(true);
          })
          .catch(() => {
            // Fallback if autoplay restricted
            setIsOpeningVideoReady(true);
          });
      }
    }

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

      {/* 2. Opening Envelope Video: Seamlessly crossfades on top as the letter comes out */}
      <video
        ref={openingVideoRef}
        src={OPENING_VIDEO_URL}
        poster={OPENING_POSTER_URL}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleOpeningTimeUpdate}
        onEnded={finishOpening}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isOpeningVideoReady ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Soft Floating Prompt: "Tap anywhere to open" */}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
            className="absolute bottom-10 sm:bottom-14 inset-x-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4"
          >
            <motion.div
              animate={{ opacity: [0.75, 1, 0.75], y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="px-6 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-[#D6B477]/40 shadow-2xl"
            >
              <p className="font-serif-luxury text-xs sm:text-sm tracking-[0.25em] text-[#FAF7F2] uppercase font-semibold flex items-center gap-2.5">
                <span className="text-[#D6B477] text-xs">✦</span>
                <span>Tap anywhere to open</span>
                <span className="text-[#D6B477] text-xs">✦</span>
              </p>
            </motion.div>
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
