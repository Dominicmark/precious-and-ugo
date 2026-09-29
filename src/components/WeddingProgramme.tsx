import React from 'react';
import { X, Clock, Sparkles } from 'lucide-react';

interface WeddingProgrammeProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROGRAMME_ITEMS = [
  {
    time: '04:00 PM',
    title: 'Arrival of Distinguished Guests',
    desc: 'Welcome reception, guest registration, and ambient musical prelude.',
  },
  {
    time: '04:30 PM',
    title: 'Processional Entry of Bridal Train & Parents',
    desc: 'Formal introduction of esteemed family dignitaries and the bridal party.',
  },
  {
    time: '05:00 PM',
    title: 'Grand Triumphant Entrance of the Couple',
    desc: 'Welcoming Mr. & Mrs. Ugochukwu Cyril Omeogu to joyous fanfare and cheers!',
  },
  {
    time: '05:30 PM',
    title: 'Opening Prayers & Solemn Blessings',
    desc: 'Dedication of the holy union, hymns, and Chairman’s opening address.',
  },
  {
    time: '06:00 PM',
    title: 'Cutting of the Nuptial Cake & Champagne Toast',
    desc: 'Symbolic sweet beginning, accompanied by royal toasts to lasting joy and health.',
  },
  {
    time: '06:45 PM',
    title: "The Couple's First Dance & Family Rhythms",
    desc: 'Intimate first dance for the newlyweds followed by vibrant traditional celebrations.',
  },
  {
    time: '07:45 PM',
    title: 'Vote of Thanks & Nuptial Celebration',
    desc: 'Expressions of profound gratitude and music celebration into the evening.',
  },
];

export const WeddingProgramme: React.FC<WeddingProgrammeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#D6B477] shadow-2xl relative max-h-[88vh] overflow-y-auto paper-texture">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-white transition-colors cursor-pointer"
          aria-label="Close programme"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1B2E] text-[#D6B477] text-[10px] font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#D6B477]" />
            <span>Order of Events</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E1B2E] tracking-wider uppercase">
            WEDDING PROGRAMME
          </h3>
          <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold tracking-widest uppercase mt-0.5">
            Friday, 13 November 2026 · 4:00 PM WAT
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {PROGRAMME_ITEMS.map((item) => (
            <div
              key={item.time}
              className="relative pl-6 pb-2 border-l border-[#D6B477] last:border-l-0"
            >
              {/* Dot indicator */}
              <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#8FB5D1] border-2 border-[#FAF7F2]" />

              <div className="p-3 rounded-xl bg-white/95 border border-[#D6B477]/40 shadow-xs">
                <div className="flex items-center gap-1.5 text-[#5687AD] text-xs font-bold font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-[#0E1B2E] mt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#0E1B2E]/75 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#D6B477]/50 text-center">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#1A3152] transition-colors cursor-pointer"
          >
            Close Programme
          </button>
        </div>
      </div>
    </div>
  );
};
