import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playEnvelopeOpenSound, playWaxBreakSound } from '../lib/audio';

interface EnvelopeProps {
  onOpenComplete: () => void;
}

const LOOPING_VIDEO_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790561471/Wedding_invitation_envelope_disp__1080p_20260928022401_hwjrhy.mp4';
const LOOPING_POSTER_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790561471/Wedding_invitation_envelope_disp__1080p_20260928022401_hwjrhy.jpg';

const OPENING_VIDEO_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790562046/Envelope_vanishes_in_golden_flash_20260928030448_re8cbd.mp4';
const OPENING_POSTER_URL =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/v1790562046/Envelope_vanishes_in_golden_flash_20260928030448_re8cbd.jpg';

export const Envelope: React.FC<EnvelopeProps> = ({ onOpenComplete }) => {
  const [stage, setStage] = useState<'idle' | 'opening' | 'flashing'>('idle');
  const openingVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  const handleTapAnywhere = () => {
    if (stage !== 'idle') return;
    setStage('opening');

    // Trigger authentic tactile audio
    playWaxBreakSound();
    setTimeout(() => {
      playEnvelopeOpenSound();
    }, 120);

    // Play the second video with the opening envelope and golden flash
    if (openingVideoRef.current) {
      openingVideoRef.current.currentTime = 0;
      openingVideoRef.current.muted = false;
      const playPromise = openingVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unmuted audio, fallback to muted play
          if (openingVideoRef.current) {
            openingVideoRef.current.muted = true;
            openingVideoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Pause the background loop video to save resources
    if (loopVideoRef.current) {
      loopVideoRef.current.pause();
    }

    // Trigger the white/golden flash transition as the video envelope vanishes
    setTimeout(() => {
      setStage('flashing');
    }, 2700);

    // Complete transition to the invitation card
    setTimeout(() => {
      onOpenComplete();
    }, 3200);
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
      {/* 1. Looping Envelope Video (with subtle light sweep on golden emboss) */}
      <video
        ref={loopVideoRef}
        src={LOOPING_VIDEO_URL}
        poster={LOOPING_POSTER_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          stage === 'idle' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      />

      {/* 2. Opening Envelope Video (opens up and vanishes into golden flash) */}
      <video
        ref={openingVideoRef}
        src={OPENING_VIDEO_URL}
        poster={OPENING_POSTER_URL}
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
          stage === 'opening' || stage === 'flashing' ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Soft Text: "Tap anywhere to open" */}
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
              className="px-6 py-2.5 rounded-full bg-black/45 backdrop-blur-md border border-[#D6B477]/40 shadow-2xl"
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

      {/* White / Golden Flash Overlay */}
      <AnimatePresence>
        {stage === 'flashing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#FFFDF7] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};



