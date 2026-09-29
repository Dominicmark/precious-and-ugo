import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { submitRSVP } from '../lib/supabase';
import { RSVPConfirmation } from './RSVPConfirmation';
import { RSVPRecord } from '../types/rsvp';
import { Send, Phone, Mail, Check, X, Users, HeartHandshake, Sparkles, MessageCircle } from 'lucide-react';
import { fireWeddingConfetti } from '../lib/confetti';
import { playCelebrationChime } from '../lib/audio';

interface RSVPFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  onSuccess,
  isModal = false,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<'accepted' | 'declined'>('accepted');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [guestNames, setGuestNames] = useState('');
  const [dietaryOrNotes, setDietaryOrNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check URL params to prefill guest name
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest') || params.get('to');
    if (guestParam && !fullName) {
      setFullName(guestParam.trim());
    }
  }, [fullName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const notesCombined = dietaryOrNotes.trim();

      const res = await submitRSVP({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        attendance,
        guest_count: attendance === 'accepted' ? Number(guestCount) : 0,
        guest_names: attendance === 'accepted' ? guestNames.trim() : '',
        dietary_or_notes: notesCombined,
      });

      if (res.success && res.data) {
        const savedRecord = res.data;
        setIsSuccessAnimating(true);
        playCelebrationChime();
        if (attendance === 'accepted') {
          fireWeddingConfetti();
        }
        // Brief pause to display the elegant immediate feedback animation
        setTimeout(() => {
          setSubmittedData(savedRecord);
          setIsSuccessAnimating(false);
          onSuccess?.();
        }, 950);
      } else {
        setErrorMsg('Unable to submit your RSVP. Please check your connection and retry.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleReset = () => {
    setSubmittedData(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setAttendance('accepted');
    setGuestCount(1);
    setGuestNames('');
    setDietaryOrNotes('');
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <AnimatePresence mode="wait">
        {submittedData ? (
          <RSVPConfirmation
            key="confirmed"
            guestName={submittedData.full_name}
            attendance={submittedData.attendance}
            guestCount={submittedData.guest_count}
            onReset={handleReset}
          />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="p-6 sm:p-7 rounded-2xl bg-white/95 border-2 border-[#D6B477]/80 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle Immediate Success Feedback Overlay */}
            <AnimatePresence>
              {isSuccessAnimating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center select-none"
                >
                  {/* Subtle Expanding Ripple Rings */}
                  <div className="relative mb-3 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut', repeat: Infinity }}
                      className="absolute w-16 h-16 rounded-full border-2 border-[#8FB5D1]"
                    />
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut', repeat: Infinity }}
                      className="absolute w-16 h-16 rounded-full border border-[#D6B477]"
                    />

                    {/* Checkmark Circle Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0E1B2E] to-[#1A3152] border-2 border-[#D6B477] flex items-center justify-center shadow-xl"
                    >
                      <motion.svg
                        className="w-8 h-8 text-[#FAF7F2]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.12 }}
                        />
                      </motion.svg>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.3 }}
                  >
                    <span className="inline-block px-3 py-0.5 rounded-full bg-[#8FB5D1]/20 text-[#5687AD] border border-[#8FB5D1]/40 text-[10px] font-bold tracking-widest uppercase mb-1">
                      Success
                    </span>
                    <h4 className="font-display text-lg font-bold uppercase tracking-wider text-[#0E1B2E]">
                      RSVP Recorded!
                    </h4>
                    <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold mt-0.5">
                      Thank you, {fullName.trim()} · Finalizing details...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Close Button if displayed in modal */}
            {isModal && onClose && (
              <button
                onClick={onClose}
                type="button"
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#0E1B2E]/60 hover:text-[#0E1B2E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="Close RSVP modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <span className="font-serif-luxury text-xs tracking-[0.25em] text-[#5687AD] uppercase font-bold">
                Kindly Respond
              </span>
              <h3 className="font-display text-2xl font-extrabold text-[#0E1B2E] tracking-widest mt-1">
                R.S.V.P.
              </h3>
              <p className="font-serif-luxury text-xs text-[#5687AD] font-semibold tracking-wider uppercase mt-1">
                Kindly RSVP by 15 October 2026
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief & Mrs. O. Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-sm text-[#0E1B2E] placeholder-[#0E1B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] focus:border-transparent transition-all"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                    Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-sm text-[#0E1B2E] placeholder-[#0E1B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-sm text-[#0E1B2E] placeholder-[#0E1B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1.5">
                  Will you be attending? <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance('accepted')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      attendance === 'accepted'
                        ? 'bg-[#0E1B2E] text-[#FAF7F2] border-[#D6B477] shadow-md'
                        : 'bg-[#FAF7F2]/80 text-[#0E1B2E] border-[#D6B477]/50 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${attendance === 'accepted' ? 'text-[#D6B477]' : 'text-[#0E1B2E]/60'}`} />
                    <span>Joyfully Accepts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('declined')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      attendance === 'declined'
                        ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                        : 'bg-[#FAF7F2]/80 text-[#0E1B2E] border-[#D6B477]/50 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <X className={`w-4 h-4 ${attendance === 'declined' ? 'text-white' : 'text-[#0E1B2E]/60'}`} />
                    <span>Regretfully Declines</span>
                  </button>
                </div>
              </div>

              {/* Conditional guest count & names if attending */}
              {attendance === 'accepted' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                        Guests
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-sm text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] font-semibold"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                        Accompanying Guest Names
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mrs. Mary Mark"
                        value={guestNames}
                        onChange={(e) => setGuestNames(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-sm text-[#0E1B2E] placeholder-[#0E1B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}


              {/* Warm Wishes or Congratulatory Note to the Couple */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#0E1B2E] uppercase mb-1">
                  Warm Wishes or Congratulatory Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Leave a heartfelt congratulatory message for the couple..."
                  value={dietaryOrNotes}
                  onChange={(e) => setDietaryOrNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D6B477]/70 bg-[#FAF7F2]/60 text-xs text-[#0E1B2E] placeholder-[#0E1B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#8FB5D1] transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isSuccessAnimating}
                className={`w-full py-3.5 px-6 rounded-xl font-display text-xs font-bold tracking-[0.2em] uppercase border shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccessAnimating
                    ? 'bg-emerald-900 text-emerald-100 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[1.01]'
                    : 'bg-[#0E1B2E] text-[#FAF7F2] border-[#D6B477] hover:bg-[#1A3152] hover:border-[#8FB5D1] active:scale-[0.98]'
                } disabled:opacity-85`}
              >
                {isSuccessAnimating ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-emerald-200"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-4 h-4 rounded-full bg-emerald-400 text-[#0E1B2E] flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </motion.div>
                    <span className="tracking-[0.25em]">RSVP RECORDED!</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D6B477] animate-pulse" />
                  </motion.div>
                ) : isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#D6B477] border-t-transparent rounded-full animate-spin" />
                    <span>SAVING RSVP...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#D6B477]" />
                    <span>CONFIRM RSVP</span>
                  </>
                )}
              </button>
            </form>

            {/* Contact Details Footer */}
            <div className="mt-5 pt-4 border-t border-[#D6B477]/40 text-center">
              <p className="font-serif-luxury text-xs text-[#0E1B2E]/80 font-medium mb-1.5">
                Questions or special accommodations contact:
              </p>
              <div className="flex items-center justify-center">
                <a
                  href={`https://wa.me/2348030000000?text=${encodeURIComponent(
                    'Hello Precious & Ugochukwu! I have a question regarding the wedding celebration (#UgoAmaka26).'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D6B477]/60 text-xs font-semibold text-[#0E1B2E] hover:text-[#25D366] hover:border-[#25D366] shadow-2xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: +234 803 000 0000</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
