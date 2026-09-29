/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Envelope } from './components/Envelope';
import { InvitationCard } from './components/InvitationCard';
import { AdminDashboard } from './components/AdminDashboard';
import { AmbientFloatingDust } from './components/AmbientFloatingDust';
import { VintageMapBackground } from './components/VintageMapBackground';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { AnimatePresence, motion } from 'motion/react';
import { toggleBackgroundMusic, isBgMusicPlaying, primeAudio } from './lib/audio';

export default function App() {
  const [view, setView] = useState<'envelope' | 'invitation' | 'admin'>('envelope');

  // Prime and unlock audio on initial user touch/click
  useEffect(() => {
    const handleFirstGesture = () => {
      primeAudio();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

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
    <main className="min-h-screen relative selection:bg-[#8FB5D1]/30 selection:text-[#0E1B2E] overflow-x-hidden">
      {/* Antique Old Map & Watercolor Floral Canvas with Watermark & Parallax Depth */}
      <VintageMapBackground />

      {/* Floating Ambient Dust */}
      <AmbientFloatingDust />

      {/* Reading Progress Bar */}
      {view === 'invitation' && <ScrollProgressBar />}

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
