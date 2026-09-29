import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const CoupleIllustratedMedallion: React.FC = () => {
  return (
    <div className="w-full max-w-[440px] mx-auto text-center py-4">
      {/* 1. Draped Fairy String Lights across the parchment */}
      <div className="relative w-full h-8 overflow-hidden pointer-events-none mb-2">
        <svg viewBox="0 0 400 40" className="w-full h-full fill-none" preserveAspectRatio="none">
          <path d="M 0,5 Q 100,28 200,8 Q 300,28 400,5" stroke="#D6B477" strokeWidth="1" opacity="0.6" />
          {/* Glowing fairy light bulbs */}
          {[40, 90, 140, 190, 240, 290, 340].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy={10 + Math.sin(i) * 5} r="4" fill="#ECC880" opacity="0.8" />
              <circle cx={cx} cy={10 + Math.sin(i) * 5} r="8" fill="#ECC880" opacity="0.25" />
            </g>
          ))}
        </svg>
      </div>

      {/* 2. Circular Couple Medallion with Ornate Victorian Lace / Doily Filigree Border */}
      <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center my-2">
        {/* Intricate Lace SVG Border */}
        <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full text-[#D6B477] fill-none">
          {/* Scalloped outer lace edge */}
          <circle cx="120" cy="120" r="114" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="120" cy="120" r="108" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="102" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 4" />

          {/* Scalloped decorative beads around the circle */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x = 120 + 108 * Math.cos(rad);
            const y = 120 + 108 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#ECC880"
                stroke="#D6B477"
                strokeWidth="0.8"
              />
            );
          })}
        </svg>

        {/* Inner Portrait Circle with Royal Navy / Golden Gradient and Monogram */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-[#D6B477] shadow-inner bg-gradient-to-br from-[#0E1B2E] via-[#142642] to-[#253D66] flex flex-col items-center justify-center text-white">
          <img
            src="https://res.cloudinary.com/dbbw8jsjc/image/upload/f_auto,q_auto:best,w_600/v1790687899/IMG-20260920-WA0002_joro3i.jpg"
            alt="Precious and Ugochukwu"
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle gold watermark starburst & vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
            <span className="inline-block px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-[#D6B477]/60 text-[9px] font-serif-luxury tracking-widest text-[#FAF7F2] uppercase">
              P &amp; U
            </span>
          </div>
        </div>
      </div>

      {/* 3. Script Subtitle & Scripture Quote */}
      <ScrollReveal direction="up" distance={16} duration={750} className="mt-3 space-y-1">
        <p className="font-script-romantic text-3xl sm:text-4xl text-[#0E1B2E]">
          A Love Written in the Stars
        </p>
        <p className="font-serif-luxury text-xs text-[#0E1B2E]/75 italic max-w-sm mx-auto leading-relaxed">
          &ldquo;I found the one whom my soul loves.&rdquo; &mdash; Song of Solomon 3:4
        </p>
      </ScrollReveal>
    </div>
  );
};
