import React, { useState } from 'react';
import { X, Gift, Copy, Check, Heart } from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface GiftRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftRegistryModal: React.FC<GiftRegistryModalProps> = ({ isOpen, onClose }) => {
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0123456789 - Guaranty Trust Bank (GTBank)');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#FAF7F2] border-2 border-[#D6B477] shadow-2xl relative paper-texture">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-white transition-colors cursor-pointer"
          aria-label="Close gift information"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-3">
          <WaxSeal size={68} />
        </div>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 text-[#5687AD] text-xs font-serif-luxury font-bold uppercase tracking-[0.25em] mb-1">
            <Gift className="w-3.5 h-3.5 text-[#8FB5D1]" />
            <span>Contributions &amp; Registry</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-wider uppercase">
            GIFTS &amp; BLESSINGS
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-white/85 border border-[#D6B477]/50 text-xs sm:text-sm text-[#0E1B2E]/85 text-center leading-relaxed font-serif-luxury space-y-3">
          <p>
            Your presence, warmth, and prayers at our wedding are the most precious gifts we could ever ask for.
          </p>
          <p className="text-xs text-[#0E1B2E]/70">
            For family and friends who have graciously inquired about a wedding gift, a monetary blessing towards our new beginning and home would be deeply and joyfully appreciated.
          </p>

          {/* Account Details Box */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F2]/80 border border-[#D6B477]/70 text-left font-sans text-xs space-y-1 mt-2">
            <div className="flex justify-between items-center text-[11px] text-[#5687AD] font-bold uppercase tracking-wider">
              <span>Wedding Nuptial Account</span>
              <span className="text-[#0E1B2E]/50">Nigeria (NGN)</span>
            </div>
            <div className="font-bold text-sm text-[#0E1B2E]">
              Precious Uzoamaka &amp; Ugochukwu Cyril
            </div>
            <div className="text-xs text-[#0E1B2E]/80">
              Guaranty Trust Bank (GTBank) · <span className="font-mono font-bold">0123456789</span>
            </div>

            <button
              onClick={handleCopyAccount}
              type="button"
              className="mt-2 w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] bg-white border border-[#D6B477]/60 hover:border-[#8FB5D1] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedBank ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Account details copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#D6B477]" />
                  <span>Copy Bank Account Details</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 rounded-xl font-display text-xs font-bold uppercase tracking-wider text-[#FAF7F2] bg-[#0E1B2E] hover:bg-[#1A3152] transition-colors cursor-pointer"
          >
            Thank You
          </button>
        </div>
      </div>
    </div>
  );
};
