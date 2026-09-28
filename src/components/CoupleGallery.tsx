import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  quote: string;
  location: string;
  gradient: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Promise of Forever',
    quote: '"I found the one my soul loves." — Song of Solomon 3:4',
    location: 'Abuja, Nigeria',
    gradient: 'from-[#0E1B2E] via-[#142642] to-[#253D66]',
  },
  {
    id: 'g-2',
    title: 'Grace & Harmony',
    quote: '"Two are better than one, because they have a good return for their labor."',
    location: 'Garki, Abuja',
    gradient: 'from-[#0A1424] via-[#1A3152] to-[#5687AD]',
  },
  {
    id: 'g-3',
    title: 'A Love Built to Last',
    quote: '"Love is patient, love is kind. It always protects, always trusts, always hopes."',
    location: 'Abuja Skyline',
    gradient: 'from-[#0E1B2E] via-[#20375A] to-[#142642]',
  },
];

export const CoupleGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((c) => (c === 0 ? GALLERY_ITEMS.length - 1 : c - 1));
  };

  const next = () => {
    setCurrentIndex((c) => (c === 0 ? 1 : c === 1 ? 2 : 0));
  };

  const current = GALLERY_ITEMS[currentIndex];

  return (
    <div className="w-full max-w-[460px] mx-auto text-center">
      {/* Section Header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Moments of Grace
        </span>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-widest uppercase mb-1">
        PRECIOUS &amp; UGOCHUKWU
      </h3>
      <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold tracking-wider uppercase mb-4">
        #UgoAmaka26 · Engagement &amp; Nuptial Showcase
      </p>

      {/* Cinematic Showcase Card */}
      <div className={`relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#D6B477] aspect-[4/3] bg-gradient-to-br ${current.gradient} flex flex-col justify-between p-6 text-white select-none`}>
        {/* Soft gold foil grid watermark */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #D6B477 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[#FAF7F2] border border-white/30">
            <Sparkles className="w-3 h-3 text-[#D6B477]" />
            <span>Editorial Series</span>
          </span>

          <span className="font-mono text-xs font-bold text-[#D6B477] bg-black/40 px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {GALLERY_ITEMS.length}
          </span>
        </div>

        {/* Center Ornate Monogram Shield */}
        <div className="relative z-10 my-auto text-center px-4">
          <div className="w-14 h-14 rounded-full border border-[#D6B477] mx-auto flex items-center justify-center bg-black/30 backdrop-blur-xs mb-3 shadow-lg">
            <span className="font-display text-xl font-bold text-[#D6B477]">PU</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">
                {current.title}
              </h4>
              <p className="font-serif-luxury text-xs sm:text-sm text-[#FAF7F2]/90 italic mt-1 max-w-xs mx-auto leading-relaxed">
                {current.quote}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Location & Controls */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20">
          <span className="font-serif-luxury text-[11px] text-[#D6B477] uppercase tracking-wider font-semibold">
            {current.location}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              type="button"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Previous photo card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              type="button"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Next photo card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
