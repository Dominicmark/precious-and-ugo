import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { ScrollToRsvpGuide } from './ScrollToRsvpGuide';

// Fast-loading 1080p stream (5MB high-bitrate vs 17MB raw)
const VIDEO_MP4 =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/f_auto,q_auto:best,w_1080/Birds_flying_in_breeze_1080p_20260929121305_syguv6.mp4';
const VIDEO_POSTER =
  'https://res.cloudinary.com/dbbw8jsjc/video/upload/f_auto,q_auto:best,w_1080/Birds_flying_in_breeze_1080p_20260929121305_syguv6.jpg';

interface HeroCinematicVideoProps {
  onOpenMenu?: () => void;
}

export const HeroCinematicVideo: React.FC<HeroCinematicVideoProps> = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for browser autoplay policies
      });
    }
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] max-h-[950px] flex flex-col justify-between items-center overflow-hidden select-none">
      {/* 1. Uncropped High-Definition Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_MP4}
        poster={VIDEO_POSTER}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-[50%_35%] pointer-events-none transition-opacity duration-700"
        style={{
          filter: 'brightness(0.82) contrast(1.05)',
        }}
      />

      {/* 2. Soft Darkening Vignette for Supreme White Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none" />

      {/* 3. Bottom Smooth Fade-Out directly to the Vintage Parchment Background (#FAF5EA) */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#FAF5EA] via-[#FAF5EA]/85 to-transparent pointer-events-none" />

      {/* 4. Top Sky Area: Couple Names with Soft, Subtle Shadow (Reduced by 40%) */}
      <div className="relative z-10 w-full pt-16 sm:pt-20 px-4 flex flex-col items-center text-center">
        <div className="space-y-1 sm:space-y-2 max-w-lg mx-auto">
          {/* Couple Names in Bolder Wedding Calligraphy (Soft Fade In) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-0.5"
          >
            <h1
              className="font-script-romantic-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight"
              style={{
                textShadow:
                  '0 1px 6px rgba(0,0,0,0.36), 0 2px 11px rgba(0,0,0,0.29), 0 0 7px rgba(214,180,119,0.14)',
              }}
            >
              Precious Uzoamaka
            </h1>

            <div
              className="font-script-romantic-bold text-3xl sm:text-4xl md:text-5xl text-[#ECC880] leading-none py-0.5 sm:py-1"
              style={{
                textShadow:
                  '0 1px 4px rgba(0,0,0,0.34), 0 0 6px rgba(214,180,119,0.21)',
              }}
            >
              &amp;
            </div>

            <h1
              className="font-script-romantic-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-tight"
              style={{
                textShadow:
                  '0 1px 6px rgba(0,0,0,0.36), 0 2px 11px rgba(0,0,0,0.29), 0 0 7px rgba(214,180,119,0.14)',
              }}
            >
              Ugochukwu Omeogu
            </h1>
          </motion.div>

          {/* Invitation Line in Pure White (Soft Fade In) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pt-3 sm:pt-5"
          >
            <p
              className="font-display text-xs sm:text-sm tracking-[0.25em] font-bold text-white/95 uppercase leading-relaxed max-w-xs sm:max-w-md mx-auto"
              style={{
                textShadow: '0 1px 4px rgba(0,0,0,0.58), 0 1px 2px rgba(0,0,0,0.60)',
              }}
            >
              JOYFULLY INVITE YOU TO THEIR WEDDING CEREMONY/ RECEPTION
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Lower Landscape Area: Invitation Prompt to Scratch Card */}
      <div className="relative z-10 w-full pb-4 sm:pb-6 px-4 flex flex-col items-center text-center">
        {/* Soft Romance Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-1"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#D6B477]/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5687AD]" />
            <span className="font-serif-luxury text-[11px] tracking-[0.2em] font-bold text-[#0E1B2E] uppercase">
              Strictly by Invitation
            </span>
          </div>
        </motion.div>

        {/* Animated Scroll to Reveal Date Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.7 }}
          className="w-full flex justify-center mt-3 mb-0"
        >
          <ScrollToRsvpGuide
            className="my-0"
            label="SCROLL TO REVEAL DATE & TIME"
          />
        </motion.div>
      </div>
    </section>
  );
};
