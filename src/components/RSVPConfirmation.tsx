import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RSVPRecord } from '../types/rsvp';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { WaxSeal } from './WaxSeal';
import { DigitalSecurityPass } from './DigitalSecurityPass';

interface RSVPConfirmationProps {
  record: RSVPRecord;
  onReset: () => void;
}

export const RSVPConfirmation: React.FC<RSVPConfirmationProps> = ({
  record,
  onReset,
}) => {
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAccepted = record.attendance === 'accepted';
  const isApproved = record.status === 'approved';

  const copyRefCode = () => {
    navigator.clipboard.writeText(record.reference_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
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

        {/* Status Badge */}
        {isAccepted ? (
          isApproved ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 mb-3 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Seat Confirmed &amp; Approved
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 mb-3 shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Under Protocol Review
              </span>
            </motion.div>
          )
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 mb-3 shadow-xs">
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Response Recorded
            </span>
          </div>
        )}

        {/* Guest Greeting */}
        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0E1B2E] tracking-wide uppercase">
          THANK YOU, {record.full_name.toUpperCase()}
        </h3>

        {/* Reference Code Ribbon */}
        {isAccepted && (
          <div className="my-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#D6B477]/60 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Verification Ref:
            </span>
            <span className="font-mono text-sm font-extrabold text-[#0E1B2E] tracking-wider">
              {record.reference_code}
            </span>
            <button
              onClick={copyRefCode}
              title="Copy Reference Code"
              className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#5687AD]" />
              )}
            </button>
          </div>
        )}

        <div className="w-16 h-[1px] bg-[#D6B477] mx-auto my-3" />

        {/* Dynamic Body Content */}
        {isAccepted ? (
          <div className="space-y-3.5 text-xs text-[#0E1B2E]/90 max-w-sm mx-auto">
            {isApproved ? (
              <>
                <p className="font-medium text-emerald-800">
                  Your seat has been officially approved! You can now view and download your Digital Security Pass.
                </p>
                <button
                  onClick={() => setShowPass(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D6B477] to-[#ECC880] text-[#0E1B2E] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0E1B2E]" />
                  <span>View Official Digital Security Pass</span>
                </button>
              </>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-left space-y-1.5">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Seat &amp; Table Allocation in Progress
                  </p>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    To maintain an intimate, secure celebration with allocated seating, our protocol team is reviewing seat assignments. You will receive an official approval notification and your personalized Digital Security Pass via WhatsApp/Email shortly.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#D6B477]/50 text-left space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#5687AD]" />
                    <span className="font-semibold text-gray-800">
                      Friday, 13 November 2026 · 10:00 AM
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#5687AD]" />
                    <span className="text-gray-700">
                      Tee Scee Event Center, 6 Area 3, Garki, Abuja
                    </span>
                  </div>
                  <div className="pt-1 text-[11px] text-[#5687AD] font-bold border-t border-[#D6B477]/30 flex justify-between">
                    <span>Requested: {record.guest_count} Guest(s)</span>
                    <span className="text-gray-500">Dress: Strictly Black-Tie</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPass(true)}
                  className="w-full py-2 px-3 rounded-xl bg-[#0E1B2E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#142338] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>Preview Pass &amp; Event Details</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#0E1B2E]/80 max-w-xs mx-auto leading-relaxed">
            We will dearly miss your presence on our special day, but we carry your love and warm blessings in our hearts.
          </p>
        )}

        {/* Action to update or close */}
        <div className="mt-5 pt-3 border-t border-[#D6B477]/30 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={onReset}
            type="button"
            className="text-xs font-semibold text-[#5687AD] hover:text-[#0E1B2E] underline underline-offset-4 decoration-[#D6B477] transition-colors cursor-pointer"
          >
            Submit another response
          </button>
        </div>
      </motion.div>

      {/* Digital Pass Modal */}
      {showPass && (
        <DigitalSecurityPass
          record={record}
          onClose={() => setShowPass(false)}
        />
      )}
    </>
  );
};
