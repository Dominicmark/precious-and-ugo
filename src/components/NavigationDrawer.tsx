import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Heart,
  Gift,
  MailOpen,
  HelpCircle,
  Send,
  MessageCircle,
  Shield,
  Camera,
  Sparkles,
  Music,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { toggleBackgroundMusic, isBgMusicPlaying, primeAudio } from '../lib/audio';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStory: () => void;
  onOpenGifts: () => void;
  onReopenEnvelope: () => void;
  onOpenAdmin: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenStory,
  onOpenGifts,
  onReopenEnvelope,
  onOpenAdmin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(isBgMusicPlaying());

    const handleStateChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ isPlaying: boolean }>;
      const playing = customEvt.detail?.isPlaying ?? isBgMusicPlaying();
      setIsPlaying(playing);
    };

    window.addEventListener('wedding-music-state-change', handleStateChange);
    return () => window.removeEventListener('wedding-music-state-change', handleStateChange);
  }, [isOpen]);

  const handleToggleMusic = () => {
    primeAudio();
    const newState = toggleBackgroundMusic();
    setIsPlaying(newState);
  };

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-[#FAF5EA] border-l border-[#D6B477]/50 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D6B477]/30">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0E1B2E] tracking-wider uppercase">
                    Precious &amp; Ugochukwu
                  </h3>
                  <span className="font-display text-[10px] tracking-[0.25em] text-[#D6B477] font-bold uppercase">
                    #UgoAmaka26
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/80 border border-[#D6B477]/60 flex items-center justify-center text-[#0E1B2E] hover:bg-[#0E1B2E] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Soundtrack Controller Inside Drawer */}
              <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-[#D6B477]/60 shadow-xs">
                <button
                  onClick={handleToggleMusic}
                  type="button"
                  className="w-full flex items-center justify-between cursor-pointer select-none text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0E1B2E] flex items-center justify-center text-[#D6B477] shadow-inner">
                      <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-[#ECC880]' : ''}`} />
                    </div>
                    <div>
                      <div className="font-serif-luxury text-xs font-bold text-[#0E1B2E]">
                        Rewrite The Stars
                      </div>
                      <div className="text-[10px] font-sans text-[#5687AD] font-semibold">
                        {isPlaying ? 'Soundtrack Playing' : 'Music Paused'}
                      </div>
                    </div>
                  </div>
                  <div className={`p-1.5 rounded-full border transition-colors ${isPlaying ? 'bg-[#0E1B2E] border-[#D6B477] text-[#D6B477]' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-5 space-y-1.5">
                <button
                  onClick={() => {
                    onClose();
                    onOpenStory();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm font-semibold text-[#0E1B2E] hover:bg-white/80 hover:text-[#5687AD] transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-[#8FB5D1]" />
                  <span>Our Journey to Forever</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenGifts();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm font-semibold text-[#0E1B2E] hover:bg-white/80 hover:text-[#5687AD] transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#D6B477]" />
                  <span className="font-bold">Gifts &amp; Blessings</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onReopenEnvelope();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm font-semibold text-[#0E1B2E] hover:bg-white/80 hover:text-[#5687AD] transition-colors cursor-pointer"
                >
                  <MailOpen className="w-4 h-4 text-[#0E1B2E]" />
                  <span>Replay Envelope Animation</span>
                </button>

                <div className="my-3 border-t border-[#D6B477]/30" />

                <button
                  onClick={() => scrollTo('scratch-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B477]" />
                  <span>Reveal Gold Foil</span>
                </button>

                <button
                  onClick={() => scrollTo('couple-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#D6B477]" />
                  <span>The Beloved Couple</span>
                </button>

                <button
                  onClick={() => scrollTo('attire-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#5687AD]" />
                  <span>Dress Code &amp; Palette</span>
                </button>

                <button
                  onClick={() => scrollTo('faq-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#5687AD]" />
                  <span>FAQ &amp; Guest Info</span>
                </button>

                <button
                  onClick={() => scrollTo('rsvp-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-display text-xs font-bold text-white bg-[#0E1B2E] hover:bg-[#1A3152] transition-colors cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#D6B477]" />
                  <span>RESPOND RSVP</span>
                </button>

                <button
                  onClick={() => scrollTo('contact-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#5687AD]" />
                  <span>WhatsApp Concierge</span>
                </button>
              </nav>
            </div>

            {/* Footer with Monogram & Admin */}
            <div className="pt-6 border-t border-[#D6B477]/30 text-center space-y-2">
              <span className="font-script text-2xl text-[#0E1B2E] block">
                P &amp; U
              </span>
              <p className="font-serif-luxury text-xs text-[#0E1B2E]/60 italic">
                13th November 2026 · Abuja, Nigeria
              </p>

              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 text-[10px] text-[#0E1B2E]/40 hover:text-[#0E1B2E] transition-colors cursor-pointer pt-2"
              >
                <Shield className="w-3 h-3 text-[#D6B477]" />
                <span>Admin Management</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
