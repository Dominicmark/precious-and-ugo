import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Calendar, MapPin, Share2 } from 'lucide-react';
import { WaxSeal } from './WaxSeal';

interface RSVPConfirmationProps {
  guestName: string;
  attendance: 'accepted' | 'declined';
  guestCount: number;
  onReset: () => void;
}

export const RSVPConfirmation: React.FC<RSVPConfirmationProps> = ({
  guestName,
  attendance,
  guestCount,
  onReset,
}) => {
  const isAccepted = attendance === 'accepted';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white to-[#FAF7F2] border-2 border-[#D6B477] text-center shadow-xl relative overflow-hidden"
    >
      {/* Top Foil Banner */}
      <div className="absolute top-0 inset-x-0 h-1.5 gold-foil-gradient" />

      {/* Wax seal emblem */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex justify-center mb-4"
      >
        <WaxSeal size={72} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8FB5D1]/20 text-[#5687AD] border border-[#8FB5D1]/40 mb-3 shadow-xs"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#5687AD]" />
        <span className="text-[10px] font-bold tracking-widest uppercase">
          RSVP Confirmed
        </span>
      </motion.div>

      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-wide uppercase">
        THANK YOU, {guestName.toUpperCase()}
      </h3>

      <p className="font-serif-luxury text-base text-[#5687AD] font-semibold mt-1">
        Your response has been received.
      </p>

      <div className="w-16 h-[1px] bg-[#D6B477] mx-auto my-4" />

      {isAccepted ? (
        <div className="space-y-3 text-xs text-[#0E1B2E]/85 max-w-xs mx-auto">
          <p className="font-medium">
            We are overjoyed to know you will be celebrating with us!
          </p>
          <div className="p-3 rounded-xl bg-white border border-[#D6B477]/50 text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#5687AD]" />
              <span className="font-semibold">Friday, 13 November 2026 · 10:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#5687AD]" />
              <span>Tee Scee Event Center, 6 Area 3, Garki, Abuja</span>
            </div>
            <div className="pt-1 text-[11px] text-[#5687AD] font-bold border-t border-[#D6B477]/30">
              Reserved Seats: {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#0E1B2E]/80 max-w-xs mx-auto">
          We will miss your presence on our special day, but we carry your love and blessings in our hearts.
        </p>
      )}

      {/* Action to update or close */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          onClick={onReset}
          type="button"
          className="text-xs font-semibold text-[#5687AD] hover:text-[#0E1B2E] underline underline-offset-4 decoration-[#D6B477] transition-colors cursor-pointer"
        >
          Submit another response or edit
        </button>
      </div>
    </motion.div>
  );
};
