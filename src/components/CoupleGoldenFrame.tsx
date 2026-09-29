import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const COUPLE_IMAGE_URL =
  'https://res.cloudinary.com/dbbw8jsjc/image/upload/f_auto,q_auto:best,w_1200/v1790687899/IMG-20260920-WA0002_joro3i.jpg';

export const CoupleGoldenFrame: React.FC = () => {
  return (
    <div className="w-full max-w-[480px] mx-auto text-center py-4 px-2">
      {/* Editorial Section Header */}
      <ScrollReveal direction="up" distance={16} duration={700}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-8 h-[1px] bg-[#D6B477]" />
          <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>The Beloved Couple</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
          </span>
          <span className="w-8 h-[1px] bg-[#D6B477]" />
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0E1B2E] tracking-widest uppercase mb-1">
          Precious &amp; Ugochukwu
        </h3>
        <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold tracking-wider uppercase mb-5">
          Precious Uzoamaka &amp; Ugochukwu Omeogu · #UgoAmaka26
        </p>
      </ScrollReveal>

      {/* Luxury Golden Frame Container */}
      <ScrollReveal direction="up" distance={22} delay={100} duration={800}>
        <div className="relative group mx-auto p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EA] to-[#F5ECE0] shadow-[0_25px_60px_-15px_rgba(14,27,46,0.25)] border-[3px] border-[#D6B477]/80">
          {/* Ornate Gold Outer Bevel */}
          <div className="absolute inset-1 sm:inset-1.5 rounded-[22px] border border-[#ECC880]/70 pointer-events-none" />

          {/* Corner Heraldic Gold Filigree Accents */}
          {/* Top-Left */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D6B477] pointer-events-none">
            <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#D6B477]" />
          </div>
          {/* Top-Right */}
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D6B477] pointer-events-none">
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D6B477]" />
          </div>
          {/* Bottom-Left */}
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D6B477] pointer-events-none">
            <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#D6B477]" />
          </div>
          {/* Bottom-Right */}
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D6B477] pointer-events-none">
            <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#D6B477]" />
          </div>

          {/* Picture Matting / Passe-Partout */}
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-inner border border-[#D6B477]/40 aspect-[4/5] sm:aspect-[4/4.8]">
            <img
              src={COUPLE_IMAGE_URL}
              alt="Precious Uzoamaka and Ugochukwu Omeogu wedding couple portrait"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
              loading="lazy"
            />

            {/* Subtle Vignette & Warm Golden Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Delicate Inner Gold Rim */}
            <div className="absolute inset-2 sm:inset-3 rounded-xl border border-white/30 pointer-events-none" />

            {/* Bottom Inscription Overlay on Picture */}
            <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-[#D6B477]/60 text-[11px] font-serif-luxury tracking-widest text-[#FAF7F2] uppercase shadow-lg">
                ✦ Forever &amp; Always ✦
              </span>
            </div>
          </div>

          {/* Engraved Gilded Nameplate Plaque Below Frame */}
          <div className="mt-3.5 pt-3 border-t border-[#D6B477]/30 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-6 h-[1px] bg-[#D6B477]" />
              <Heart className="w-3.5 h-3.5 text-[#D6B477] fill-[#D6B477]" />
              <span className="w-6 h-[1px] bg-[#D6B477]" />
            </div>

            <p className="font-serif-luxury text-sm sm:text-base font-bold text-[#0E1B2E] tracking-wide">
              Mr. &amp; Mrs. Ugochukwu Omeogu
            </p>
            <p className="font-serif-luxury text-xs text-[#0E1B2E]/70 italic mt-0.5 max-w-xs leading-relaxed">
              &ldquo;I have found the one whom my soul loves.&rdquo;
              <span className="block not-italic text-[10px] text-[#5687AD] font-semibold mt-0.5 uppercase tracking-wider">
                — Song of Solomon 3:4
              </span>
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
