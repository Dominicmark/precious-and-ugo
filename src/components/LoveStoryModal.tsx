import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface LoveStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveStoryModal: React.FC<LoveStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border-2 border-[#D6B477] shadow-2xl relative max-h-[88vh] overflow-y-auto paper-texture">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-white transition-colors cursor-pointer"
          aria-label="Close love story"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-3">
          <WaxSeal size={70} />
        </div>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 text-[#5687AD] text-xs font-serif-luxury font-bold uppercase tracking-[0.25em] mb-1">
            <Heart className="w-3.5 h-3.5 fill-[#8FB5D1] text-[#8FB5D1]" />
            <span>Our Journey to Forever</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E1B2E] tracking-wider uppercase">
            PRECIOUS &amp; UGOCHUKWU
          </h3>
          <p className="font-serif-luxury text-sm text-[#D6B477] font-semibold italic mt-0.5">
            Two souls anchored in faith, love, and endless grace
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#0E1B2E]/85 leading-relaxed font-serif-luxury text-justify bg-white/80 p-5 rounded-xl border border-[#D6B477]/40 shadow-xs">
          <p>
            What began as an unspoken spark of admiration blossomed with each shared laughter, quiet prayer, and mutual reverence for purpose. From our very first conversation, there was a profound peace that felt like arriving home.
          </p>
          <p>
            Through every milestone, distance, and triumphs, our bond deepened under God's unchanging grace. Ugochukwu found in Precious a radiant crown of wisdom, gentleness, and unwavering strength; Precious found in Ugochukwu a steadfast protector, partner, and true best friend.
          </p>
          <p className="italic text-[#5687AD] font-semibold text-center pt-2 border-t border-[#D6B477]/30">
            "And above all these put on love, which binds everything together in perfect harmony." — Colossians 3:14
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#1A3152] transition-colors cursor-pointer"
          >
            Return to Invitation
          </button>
        </div>
      </div>
    </div>
  );
};
