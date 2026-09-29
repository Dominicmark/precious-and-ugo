import React from 'react';
import { Sparkles, Heart, Info, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ColorSwatch {
  name: string;
  hex: string;
  desc: string;
  note?: string;
  border?: string;
}

const PALETTE: ColorSwatch[] = [
  { name: 'Royal Navy', hex: '#0E1B2E', desc: 'Regal Depth & Mystery' },
  { name: 'Burnt Orange', hex: '#C25E2E', desc: 'Warm Radiant Joy' },
  { name: 'Dusty Sky Blue', hex: '#5687AD', desc: 'Serene Elegance' },
  { name: 'Champagne Gold', hex: '#D6B477', desc: 'Lustrous Festivity' },
  { name: 'Warm Ivory', hex: '#FAF7F2', border: '#D6B477', desc: 'Bride Reserve', note: 'Bride only' },
];

export const DressCodeShowcase: React.FC = () => {
  return (
    <div className="w-full max-w-[500px] mx-auto text-center py-4 px-2">
      {/* 1. Cascading Wisteria Garland Top Illustration */}
      <div className="relative w-full h-10 overflow-hidden pointer-events-none mb-1">
        <svg viewBox="0 0 400 40" className="w-full h-full fill-none" preserveAspectRatio="none">
          {[30, 80, 130, 180, 230, 280, 330, 370].map((x, i) => (
            <g key={x} opacity="0.65">
              <path
                d={`M ${x},0 Q ${x + (i % 2 === 0 ? 4 : -4)},18 ${x},${28 + (i % 3) * 6}`}
                stroke="#5687AD"
                strokeWidth="1.2"
                strokeDasharray="2 3"
              />
              <circle cx={x} cy={14} r="2.5" fill="#8FB5D1" />
              <circle cx={x - 2} cy={20} r="2" fill="#C25E2E" opacity="0.8" />
              <circle cx={x + 2} cy={26} r="2" fill="#D6B477" />
            </g>
          ))}
        </svg>
      </div>

      {/* 2. Editorial Section Header */}
      <ScrollReveal direction="up" distance={16} duration={700}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-8 h-[1px] bg-[#D6B477]" />
          <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            <span>Nuptial Dress Code</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
          </span>
          <span className="w-8 h-[1px] bg-[#D6B477]" />
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0E1B2E] tracking-widest uppercase mb-1">
          Attire &amp; Nuptial Palette
        </h3>
        <p className="font-serif-luxury text-xs text-[#C25E2E] font-semibold tracking-wider uppercase mb-5">
          Strictly Formal · Black-Tie &amp; Regal African Elegance
        </p>
      </ScrollReveal>

      {/* 3. TUXEDO & FEMALE DRESS SILHOUETTES CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-left">
        {/* GENTLEMEN: TUXEDO & BOW TIE SILHOUETTE */}
        <ScrollReveal direction="up" distance={18} delay={100} duration={750}>
          <div className="h-full rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] p-5 border-2 border-[#D6B477]/70 shadow-[0_8px_25px_-5px_rgba(14,27,46,0.08)] flex flex-col items-center text-center">
            {/* Tuxedo & Bow Tie Vector Silhouette */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center mb-3 relative">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full text-[#0E1B2E] drop-shadow-md"
                fill="none"
              >
                {/* Shoulders & Suit Jacket Body */}
                <path
                  d="M 20,38 L 5,60 L 15,115 L 85,115 L 95,60 L 80,38 Z"
                  fill="currentColor"
                />
                {/* Crisp White Shirt V-Front */}
                <polygon points="35,38 65,38 50,88" fill="#FFFFFF" />

                {/* Left Satin Lapel */}
                <path
                  d="M 20,38 L 35,38 L 50,88 L 36,88 L 18,52 Z"
                  fill="#1C2D47"
                  stroke="#D6B477"
                  strokeWidth="0.8"
                />
                {/* Right Satin Lapel */}
                <path
                  d="M 80,38 L 65,38 L 50,88 L 64,88 L 82,52 Z"
                  fill="#1C2D47"
                  stroke="#D6B477"
                  strokeWidth="0.8"
                />

                {/* Shirt Collar */}
                <polygon points="38,36 50,44 42,48" fill="#F0F0F0" />
                <polygon points="62,36 50,44 58,48" fill="#F0F0F0" />

                {/* Center Bow Tie with Gold Knot */}
                <g transform="translate(50, 42)">
                  {/* Left bow wing */}
                  <path d="M 0,0 L -12,-6 L -12,6 Z" fill="#C25E2E" stroke="#D6B477" strokeWidth="0.6" />
                  {/* Right bow wing */}
                  <path d="M 0,0 L 12,-6 L 12,6 Z" fill="#C25E2E" stroke="#D6B477" strokeWidth="0.6" />
                  {/* Center knot */}
                  <circle cx="0" cy="0" r="3" fill="#D6B477" />
                </g>

                {/* Tuxedo Shirt Studs */}
                <circle cx="50" cy="58" r="1.5" fill="#D6B477" />
                <circle cx="50" cy="68" r="1.5" fill="#D6B477" />
                <circle cx="50" cy="78" r="1.5" fill="#D6B477" />

                {/* Pocket Square with Gold Accent */}
                <polygon points="26,62 34,62 30,56" fill="#D6B477" />
              </svg>
            </div>

            <div className="w-full">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0E1B2E] text-[#D6B477] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Gentlemen
              </span>
              <h4 className="font-serif-luxury text-base font-bold text-[#0E1B2E]">
                Tuxedo &amp; African Agbada
              </h4>
              <p className="font-serif-luxury text-xs text-[#0E1B2E]/80 mt-1.5 leading-relaxed">
                Black-tie tuxedo, tailored navy / dark suit with silk bow tie, or regal traditional Nigerian Agbada / Senator attire.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* LADIES: FEMALE DRESS WITH HEART SILHOUETTE */}
        <ScrollReveal direction="up" distance={18} delay={200} duration={750}>
          <div className="h-full rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF7F2] p-5 border-2 border-[#D6B477]/70 shadow-[0_8px_25px_-5px_rgba(14,27,46,0.08)] flex flex-col items-center text-center">
            {/* Female Gown with Heart Silhouette */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center mb-3 relative">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full text-[#C25E2E] drop-shadow-md"
                fill="none"
              >
                {/* Graceful Shoulders / Neckline Straps */}
                <path d="M 32,24 Q 50,30 68,24" stroke="#D6B477" strokeWidth="1.2" />

                {/* Sweetheart Bodice */}
                <path
                  d="M 32,24 C 36,36 44,42 50,45 C 56,42 64,36 68,24 C 70,38 66,54 58,58 L 42,58 C 34,54 30,38 32,24 Z"
                  fill="currentColor"
                  stroke="#D6B477"
                  strokeWidth="0.8"
                />

                {/* Gilded Heart woven on Bodice */}
                <g transform="translate(50, 36) scale(0.65)">
                  <path
                    d="M 0, -3 C -5, -10 -14, -8 -14, 0 C -14, 8 0, 16 0, 16 C 0, 16 14, 8 14, 0 C 14, -8 5, -10 0, -3 Z"
                    fill="#D6B477"
                  />
                </g>

                {/* Cinch Belt / Sash */}
                <rect x="42" y="58" width="16" height="3" rx="1" fill="#D6B477" />

                {/* Flowing Ballgown / A-line Mermaid Skirt */}
                <path
                  d="M 42,61 Q 30,85 10,115 Q 50,118 90,115 Q 70,85 58,61 Z"
                  fill="currentColor"
                  opacity="0.95"
                />

                {/* Elegant Gown Drape Folds */}
                <path d="M 50,61 Q 50,88 50,117" stroke="#D6B477" strokeWidth="0.8" opacity="0.7" />
                <path d="M 46,61 Q 38,88 30,116" stroke="#D6B477" strokeWidth="0.6" opacity="0.6" />
                <path d="M 54,61 Q 62,88 70,116" stroke="#D6B477" strokeWidth="0.6" opacity="0.6" />

                {/* Hem Lace Sparkle Trim */}
                <path
                  d="M 10,115 Q 50,118 90,115"
                  stroke="#D6B477"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              </svg>
            </div>

            <div className="w-full">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C25E2E] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Ladies
              </span>
              <h4 className="font-serif-luxury text-base font-bold text-[#0E1B2E]">
                Floor-Length Gowns &amp; Regal Lace
              </h4>
              <p className="font-serif-luxury text-xs text-[#0E1B2E]/80 mt-1.5 leading-relaxed">
                Floor-length formal evening gowns, chic cocktail dresses, or rich African lace &amp; Gele in our celebratory palette.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* 4. COLOR PALETTE SWATCHES */}
      <ScrollReveal direction="up" distance={16} delay={250} duration={700}>
        <div className="my-5 p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#D6B477]/40 shadow-xs">
          <p className="font-serif-luxury text-xs uppercase tracking-[0.2em] text-[#5687AD] font-bold mb-3">
            Official Nuptial Color Palette
          </p>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {PALETTE.map((c) => (
              <div key={c.name} className="flex flex-col items-center group">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110 flex items-center justify-center relative cursor-default"
                  style={{
                    backgroundColor: c.hex,
                    border: c.border ? `2px solid ${c.border}` : '1.5px solid rgba(214,180,119,0.6)',
                  }}
                  title={`${c.name}: ${c.desc}`}
                >
                  {c.note && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C25E2E] text-white flex items-center justify-center text-[7px] font-bold">
                      !
                    </span>
                  )}
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white/25 pointer-events-none" />
                </div>

                <span className="font-display text-[9px] sm:text-[10px] font-bold text-[#0E1B2E] mt-1.5 uppercase tracking-wider text-center leading-tight">
                  {c.name}
                </span>
                <span className="font-serif-luxury text-[8px] sm:text-[9px] text-[#0E1B2E]/60 italic hidden sm:block">
                  {c.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 5. ELABORATED COURTESY GUIDELINES */}
      <ScrollReveal direction="up" distance={14} delay={300} duration={700}>
        <div className="p-4 rounded-xl bg-[#FAF5EA] border border-[#D6B477]/50 text-left space-y-2">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#D6B477] shrink-0 mt-0.5" />
            <p className="font-serif-luxury text-xs text-[#0E1B2E]/85 leading-relaxed">
              <strong>Embrace The Palette:</strong> We warmly invite our esteemed family and friends to incorporate our wedding colors — <strong>Royal Navy, Burnt Orange, Dusty Sky Blue, and Champagne Gold</strong> — into your attire.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C25E2E] shrink-0 mt-0.5" />
            <p className="font-serif-luxury text-xs text-[#0E1B2E]/85 leading-relaxed">
              <strong>Kindly Note:</strong> We respectfully request that all shades of pure white, ivory, and cream dresses be reserved exclusively for the beautiful bride.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
