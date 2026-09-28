import React from 'react';
import { Sparkles } from 'lucide-react';

export const DressCode: React.FC = () => {
  return (
    <div className="w-full max-w-[440px] mx-auto text-center">
      {/* Section Header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-8 h-[1px] bg-[#D6B477]" />
        <p className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
          Attire Guidelines
        </p>
        <span className="w-8 h-[1px] bg-[#D6B477]" />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-widest mb-1">
        DRESS CODE
      </h3>

      <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#0E1B2E] text-[#D6B477] border border-[#D6B477]/50 shadow-sm mb-5">
        <Sparkles className="w-3 h-3 text-[#D6B477]" />
        <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">
          BLACK TIE
        </span>
      </div>

      {/* Editorial Dual Columns for Gentlemen and Ladies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
        {/* Gentlemen */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/95 border border-[#D6B477]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#D6B477]/30">
              {/* Bowtie SVG vector */}
              <svg className="w-4 h-4 text-[#0E1B2E]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6l8 6-8 6V6zm16 0l-8 6 8 6V6zm-8 4a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <h4 className="font-display text-xs font-bold tracking-[0.2em] text-[#0E1B2E] uppercase">
                GENTLEMEN
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs text-[#0E1B2E]/85 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-[#8FB5D1] font-bold">·</span>
                <span>Black tuxedo or formal deep navy / black suit</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8FB5D1] font-bold">·</span>
                <span>Crisp white dress shirt</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8FB5D1] font-bold">·</span>
                <span>Black or navy bow tie</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#8FB5D1] font-bold">·</span>
                <span>Formal black leather shoes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ladies */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/95 border border-[#D6B477]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#D6B477]/30">
              {/* Evening Gown silhouette icon */}
              <svg className="w-4 h-4 text-[#5687AD]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l-3 6h6l-3-6zm-4 7l-3 13h14l-3-13H8z" />
              </svg>
              <h4 className="font-display text-xs font-bold tracking-[0.2em] text-[#5687AD] uppercase">
                LADIES
              </h4>
            </div>

            <ul className="space-y-1.5 text-xs text-[#0E1B2E]/85 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-[#D6B477] font-bold">·</span>
                <span>Elegant floor-length evening gown</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#D6B477] font-bold">·</span>
                <span>Formal heels / evening shoes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#D6B477] font-bold">·</span>
                <span>Fascinators &amp; formal accents encouraged</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#0E1B2E]/60 font-serif-luxury italic mt-3">
        Thank you for dressing with grandeur to honour this momentous celebration.
      </p>
    </div>
  );
};
