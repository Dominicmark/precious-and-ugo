import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const GiftsShowcase: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0123456789 - GTBank (Precious Uzoamaka & Ugochukwu Omeogu)');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto text-center py-4 px-2">
      {/* 1. Illustrated Gift Box with Ribbon (inspired by Screenshot 4) */}
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 rounded-full bg-[#FAF5EA] border-2 border-[#D6B477] shadow-sm flex items-center justify-center text-[#D6B477]">
          <Gift className="w-6 h-6 text-[#5687AD]" />
        </div>
      </div>

      {/* 2. Clear Luxury Heading */}
      <ScrollReveal direction="up" distance={16} duration={700}>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0E1B2E] tracking-tight block">
          Gifts &amp; Blessings
        </h3>

        {/* 3. Easily Readable Text */}
        <p className="font-serif-luxury text-xs sm:text-sm text-[#0E1B2E]/85 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Your presence at our celebration is truly a gift to us. For loved ones who wish to honour us with a gift, our celebration account details are provided below.
        </p>
      </ScrollReveal>

      {/* 4. Elegant Account Pill Box */}
      <ScrollReveal direction="up" distance={16} delay={150} duration={750}>
        <div className="mt-4 p-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#D6B477]/60 shadow-xs max-w-xs mx-auto">
        <div className="text-[10px] font-bold text-[#5687AD] uppercase tracking-[0.2em] mb-1">
          Nuptial Celebration Account
        </div>
        <div className="font-display text-xs font-bold text-[#0E1B2E]">
          Precious Uzoamaka &amp; Ugochukwu Omeogu
        </div>
        <div className="font-mono text-xs text-[#0E1B2E]/80 mt-0.5 font-semibold">
          GTBank · 0123456789
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyAccount}
          type="button"
          className="mt-3 w-full py-2 px-3 rounded-xl bg-[#0E1B2E] text-[#FAF7F2] font-display text-[10px] font-bold tracking-widest uppercase hover:bg-[#1A3152] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACCOUNT COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>COPY ACCOUNT DETAILS</span>
            </>
          )}
        </button>
      </div>
      </ScrollReveal>
    </div>
  );
};
