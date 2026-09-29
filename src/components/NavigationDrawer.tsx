import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Gift, MailOpen, Calendar, HelpCircle, Send, MessageCircle, Shield, Camera, Sparkles } from 'lucide-react';

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
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-[#FAF5EA] border-l border-[#D6B477]/50 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D6B477]/40">
                <div>
                  <span className="font-script text-2xl text-[#0E1B2E] block">
                    Precious &amp; Ugochukwu
                  </span>
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

              {/* Navigation Items */}
              <nav className="mt-6 space-y-1.5">
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
                  onClick={() => scrollTo('timeline-section')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-serif-luxury text-sm text-[#0E1B2E] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#5687AD]" />
                  <span>Order of Events</span>
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
                  <Sparkles className="w-4 h-4 text-[#C25E2E]" />
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
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Concierge</span>
                </button>
              </nav>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-[#D6B477]/40 text-center space-y-2">
              <span className="font-cursive text-2xl text-[#0E1B2E]">
                Mentored by Love
              </span>
              <p className="font-display text-[9px] tracking-[0.25em] text-[#5687AD] uppercase">
                13 November 2026 · 4:00 PM WAT
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1 text-[9px] text-[#0E1B2E]/40 hover:text-[#5687AD] transition-colors cursor-pointer mt-1"
              >
                <Shield className="w-2.5 h-2.5 text-[#D6B477]" />
                <span>Admin Access</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
