import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { submitRSVP } from '../lib/supabase';
import { RSVPConfirmation } from './RSVPConfirmation';
import { GuestStatusLookupModal } from './GuestStatusLookupModal';
import { RSVPRecord, GuestRelationship } from '../types/rsvp';
import {
  Send,
  Phone,
  Mail,
  Check,
  X,
  Users,
  HeartHandshake,
  Sparkles,
  MessageCircle,
  ShieldAlert,
  Search,
} from 'lucide-react';
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
  const [relationship, setRelationship] = useState<GuestRelationship>("Bride's Family / Guest");
  const [dietaryOrNotes, setDietaryOrNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showStatusLookup, setShowStatusLookup] = useState(false);

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
      setErrorMsg('Please enter your full name and title.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your WhatsApp or mobile phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRSVP({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        attendance,
        guest_count: attendance === 'accepted' ? Number(guestCount) : 0,
        guest_names: attendance === 'accepted' ? guestNames.trim() : '',
        relationship,
        dietary_or_notes: dietaryOrNotes.trim(),
      });

      if (res.success && res.data) {
        const savedRecord = res.data;
        setIsSuccessAnimating(true);
        playCelebrationChime();
        if (attendance === 'accepted') {
          fireWeddingConfetti();
        }
        setTimeout(() => {
          setSubmittedData(savedRecord);
          setIsSuccessAnimating(false);
          onSuccess?.();
        }, 900);
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
    setGuestCount(1);
    setGuestNames('');
    setDietaryOrNotes('');
    setAttendance('accepted');
  };

  if (submittedData) {
    return <RSVPConfirmation record={submittedData} onReset={handleReset} />;
  }

  return (
    <>
      <div className="relative rounded-2xl bg-[#FAF7F2] border-2 border-[#D6B477] p-5 sm:p-7 shadow-xl">
        {/* Top Gold Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 gold-foil-gradient rounded-t-2xl" />

        {/* Header & Protocol Notice */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8FB5D1]/15 text-[#5687AD] border border-[#8FB5D1]/40 mb-2">
            <Sparkles className="w-3 h-3 text-[#D6B477]" />
            <span className="font-serif-luxury text-[11px] tracking-widest font-bold uppercase">
              Strictly by Invitation · Allocated Seating
            </span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0E1B2E] uppercase tracking-wider">
            Confirm Your Attendance
          </h2>
          <p className="font-serif-luxury text-xs sm:text-sm text-[#5687AD] mt-1">
            Please register your details to receive your official table allocation and digital gate security pass.
          </p>

          {/* Quick Status Check Link */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowStatusLookup(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E1B2E] hover:text-[#5687AD] underline underline-offset-4 decoration-[#D6B477] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Already submitted? Check your RSVP Status / Pass</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Attendance Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAttendance('accepted')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                attendance === 'accepted'
                  ? 'bg-[#0E1B2E] text-white border-[#D6B477] shadow-md ring-2 ring-[#D6B477]/40'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#D6B477]/50'
              }`}
            >
              <Check className={`w-4 h-4 ${attendance === 'accepted' ? 'text-[#ECC880]' : 'text-gray-400'}`} />
              <span className="font-display text-xs font-bold uppercase tracking-wider">
                Accepts with Joy
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAttendance('declined')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                attendance === 'declined'
                  ? 'bg-[#0E1B2E] text-white border-[#D6B477] shadow-md ring-2 ring-[#D6B477]/40'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#D6B477]/50'
              }`}
            >
              <X className={`w-4 h-4 ${attendance === 'declined' ? 'text-red-400' : 'text-gray-400'}`} />
              <span className="font-display text-xs font-bold uppercase tracking-wider">
                Regretfully Declines
              </span>
            </button>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
              Full Name &amp; Title *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. &amp; Mrs. Chinedu Eze"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
            />
          </div>

          {/* Phone & Email in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
                WhatsApp / Phone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chinedu@example.com"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Relationship / Guest Of */}
          <div>
            <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
              Guest Of / Affiliation
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as GuestRelationship)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
            >
              <option value="Bride's Family / Guest">Bride&apos;s Family / Guest (Amaka)</option>
              <option value="Groom's Family / Guest">Groom&apos;s Family / Guest (Ugo)</option>
              <option value="Mutual Friend / Colleague">Mutual Friend / Colleague</option>
              <option value="VIP Dignitary">VIP Dignitary / Protocol</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* If Attending: Requested Seats & Accompanying Names */}
          {attendance === 'accepted' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-1"
            >
              <div>
                <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
                  Requested Seats Allocation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount(1)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      guestCount === 1
                        ? 'bg-[#0E1B2E] text-white border-[#D6B477]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    1 Seat (Solo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestCount(2)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      guestCount === 2
                        ? 'bg-[#0E1B2E] text-white border-[#D6B477]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    2 Seats (Plus One)
                  </button>
                </div>
              </div>

              {guestCount === 2 && (
                <div>
                  <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
                    Accompanying Guest Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestNames}
                    onChange={(e) => setGuestNames(e.target.value)}
                    placeholder="e.g. Mrs. Ngozi Eze"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Dietary Notes or Wishes */}
          <div>
            <label className="block text-xs font-bold text-[#0E1B2E] uppercase tracking-wider mb-1">
              {attendance === 'accepted' ? 'Special Dietary Notes & Warm Wishes' : 'Warm Wishes for the Couple'}
            </label>
            <textarea
              rows={2}
              value={dietaryOrNotes}
              onChange={(e) => setDietaryOrNotes(e.target.value)}
              placeholder="e.g. Vegetarian, Halal, or prayers for the couple..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D6B477]/70 text-sm text-[#0E1B2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D6B477]/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-xl bg-[#0E1B2E] hover:bg-[#142338] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <span>Securing Your Reservation...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#ECC880]" />
                <span>
                  {attendance === 'accepted'
                    ? 'Submit RSVP for Protocol Approval'
                    : 'Submit Response'}
                </span>
              </>
            )}
          </button>

          {/* Security Protocol Footnote */}
          <div className="pt-2 text-center">
            <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#D6B477]" />
              <span>
                Dress Code strictly Black-Tie. Unregistered attendees will not be granted venue entry.
              </span>
            </p>
          </div>
        </form>
      </div>

      {/* Guest Status Lookup Modal */}
      <GuestStatusLookupModal
        isOpen={showStatusLookup}
        onClose={() => setShowStatusLookup(false)}
      />
    </>
  );
};
