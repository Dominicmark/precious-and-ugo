import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { lookupRSVP } from '../lib/supabase';
import { RSVPRecord } from '../types/rsvp';
import { DigitalSecurityPass } from './DigitalSecurityPass';
import {
  Search,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface GuestStatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRSVPForm?: () => void;
}

export const GuestStatusLookupModal: React.FC<GuestStatusLookupModalProps> = ({
  isOpen,
  onClose,
  onOpenRSVPForm,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<RSVPRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFullPass, setShowFullPass] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearched(true);
    try {
      const match = await lookupRSVP(query.trim());
      setResult(match);
    } catch {
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setSearched(false);
    setShowFullPass(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-white border-2 border-[#D6B477] p-6 sm:p-7 shadow-2xl text-center overflow-hidden"
        >
          {/* Top Foil Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 gold-foil-gradient" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-[#D6B477]/40 flex items-center justify-center text-[#0E1B2E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#0E1B2E]" />
          </button>

          {/* Header */}
          <div className="flex justify-center mb-3">
            <WaxSeal size={56} />
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-[#0E1B2E] uppercase tracking-wider">
            Check Invitation Status
          </h3>
          <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold mt-1">
            Enter your Phone Number, Email, or Reference Code (e.g. PU-7241)
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-5 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Phone, email or PU-XXXX"
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50 shadow-inner"
              />
              <Search className="w-4 h-4 text-[#D6B477] absolute left-3.5 top-3" />
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0E1B2E] hover:bg-[#142338] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <span>Searching Registry...</span>
              ) : (
                <>
                  <span>Lookup Invitation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ECC880]" />
                </>
              )}
            </button>
          </form>

          {/* Search Results Display */}
          <div className="mt-5 text-left">
            {searched && !isSearching && result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white border border-[#D6B477]/60 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#D6B477]/30">
                  <div>
                    <span className="font-display text-xs font-extrabold text-[#0E1B2E] block uppercase">
                      {result.full_name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Ref: {result.reference_code}
                    </span>
                  </div>

                  {result.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Approved
                    </span>
                  ) : result.status === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase border border-amber-300">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Under Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase border border-gray-300">
                      Declined
                    </span>
                  )}
                </div>

                {result.status === 'approved' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-700">
                      Your invitation is <strong className="text-emerald-700">Approved &amp; Confirmed</strong> for <strong>{result.allocated_seats || 1} guest(s)</strong>.
                    </p>
                    <button
                      onClick={() => setShowFullPass(true)}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0E1B2E]" />
                      View Official Digital Pass
                    </button>
                  </div>
                ) : result.status === 'pending' ? (
                  <div className="space-y-1 text-xs text-gray-700">
                    <p className="font-semibold text-amber-800">
                      Seat &amp; Table Allocation in Progress
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Our protocol team is reviewing seat assignments. You will receive an official approval notification and your personalized Digital Security Pass via WhatsApp/Email shortly.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    Thank you for notifying us. We carry your warm wishes in our hearts.
                  </p>
                )}

                <div className="pt-2 text-center">
                  <button
                    onClick={handleReset}
                    className="text-[11px] font-semibold text-[#5687AD] hover:underline"
                  >
                    Check another reference
                  </button>
                </div>
              </motion.div>
            )}

            {searched && !isSearching && !result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-center space-y-2"
              >
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>No Invitation Record Found</span>
                </div>
                <p className="text-[11px] text-red-600">
                  We could not find an RSVP under &quot;{query}&quot;. Please verify the spelling, phone number, or submit a new RSVP.
                </p>
                {onOpenRSVPForm && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRSVPForm();
                    }}
                    className="text-xs font-bold text-[#0E1B2E] underline underline-offset-2 hover:text-[#5687AD]"
                  >
                    Submit an RSVP now →
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Full Digital Security Pass Modal */}
      {showFullPass && result && (
        <DigitalSecurityPass
          record={result}
          onClose={() => setShowFullPass(false)}
        />
      )}
    </>
  );
};
