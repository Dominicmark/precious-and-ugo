/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Envelope } from './components/Envelope';
import { InvitationCard } from './components/InvitationCard';
import { AdminDashboard } from './components/AdminDashboard';
import { AmbientFloatingDust } from './components/AmbientFloatingDust';
import { ParallaxBackgroundDecorations } from './components/ParallaxBackgroundDecorations';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { toggleBackgroundMusic, isBgMusicPlaying } from './lib/audio';

export default function App() {
  const [view, setView] = useState<'envelope' | 'invitation' | 'admin'>('envelope');

  // Parallax background scroll tracking
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const smoothScrollY = useSpring(scrollY, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  });

  // Background shifts gently downward at a subtle rate (-0.08x) for true spatial depth
  const backgroundY = useTransform(smoothScrollY, [0, 3000], [0, -180]);
  const backgroundScale = useTransform(smoothScrollY, [0, 3000], [1.02, 1.08]);

  // Check URL hash for direct admin routing (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setView('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleEnvelopeOpened = () => {
    setView('invitation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isBgMusicPlaying()) {
      toggleBackgroundMusic(true);
    }
  };

  const handleReopenEnvelope = () => {
    setView('envelope');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToInvitation = () => {
    window.location.hash = '';
    setView('invitation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen relative selection:bg-[#8FB5D1]/30 selection:text-[#0E1B2E]">
      {/* 2K Watercolor Floral Wedding Background with Smooth Parallax Depth */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : backgroundY,
          scale: shouldReduceMotion ? 1 : backgroundScale,
          backgroundImage:
            'url("https://res.cloudinary.com/dbbw8jsjc/image/upload/f_auto,q_auto:good,w_1600/v1790564842/Watercolor_floral_wedding_invita__2K_20260928040504_c91ftu.jpg")',
          transformOrigin: 'center center',
        }}
        className="fixed -inset-y-16 inset-x-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-1000 will-change-transform"
      >
        {/* Soft luxury veil overlay to ensure pristine contrast, legibility, and elegance */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/45 via-[#FAF7F2]/30 to-[#FAF7F2]/55 backdrop-blur-[1px]" />
      </motion.div>

      {/* Floating Ambient Dust */}
      <AmbientFloatingDust />

      {/* Parallax Floating Margin Accents & Reading Progress Bar */}
      {view === 'invitation' && (
        <>
          <ScrollProgressBar />
          <ParallaxBackgroundDecorations />
        </>
      )}

      <AnimatePresence mode="wait">
        {view === 'envelope' && (
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="w-full flex items-center justify-center min-h-screen relative z-10"
          >
            <Envelope onOpenComplete={handleEnvelopeOpened} />
          </motion.div>
        )}

        {view === 'invitation' && (
          <motion.div
            key="invitation-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <InvitationCard
              onReopenEnvelope={handleReopenEnvelope}
              onOpenAdmin={handleOpenAdmin}
            />
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <AdminDashboard onBackToInvitation={handleBackToInvitation} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
